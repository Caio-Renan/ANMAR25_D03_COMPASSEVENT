import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { DynamoService } from 'common/aws/dynamo.service';
import { Status } from 'common/enums/status.enum';
import { Uuid } from 'common/value-objects';

import { Subscription } from '../entities/subscription.entity';
import { SubscriptionItem } from '../interfaces/subscription.interface';

@Injectable()
export class SubscriptionRepository {
  private readonly tableName = 'Subscriptions';
  private readonly userIdIndex = 'userId-index';
  private readonly eventIdIndex = 'eventId-index';
  private readonly statusCreatedAtIndex = 'status-createdAt-index';
  private readonly userEventIndex = 'user-event-index';

  constructor(private readonly dynamoService: DynamoService) {}

  async create(subscription: Subscription): Promise<void> {
    await this.dynamoService.put({
      TableName: this.tableName,
      Item: this.toItem(subscription),
    });
  }

  async update(subscription: Subscription): Promise<void> {
    const fieldsToUpdate: Record<string, unknown> = {
      userId: subscription.userId?.value,
      eventId: subscription.eventId?.value,
      status: subscription.status,
      updatedAt: subscription.updatedAt?.toISOString(),
    };

    Object.keys(fieldsToUpdate).forEach(
      key =>
        (fieldsToUpdate[key] === undefined || fieldsToUpdate[key] === null) &&
        delete fieldsToUpdate[key],
    );

    const { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      this.buildUpdateExpression(fieldsToUpdate);

    await this.dynamoService.update({
      TableName: this.tableName,
      Key: { id: subscription.id.value },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    });
  }

  async softDelete(id: Uuid): Promise<void> {
    await this.dynamoService.update({
      TableName: this.tableName,
      Key: { id: id.value },
      UpdateExpression: 'SET #status = :inactive',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':inactive': Status.INACTIVE },
    });
  }

  async findById(id: Uuid): Promise<Subscription | null> {
    const result = await this.dynamoService.get({
      TableName: this.tableName,
      Key: { id: id.value },
    });

    return result ? this.toEntity(result as SubscriptionItem) : null;
  }

  async findByUserId(userId: Uuid): Promise<Subscription[]> {
    const { Items } = await this.dynamoService.query({
      TableName: this.tableName,
      IndexName: this.userIdIndex,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: { '#userId': 'userId' },
      ExpressionAttributeValues: { ':userId': userId.value },
    });

    return (Items ?? []).map(item => this.toEntity(item as SubscriptionItem));
  }

  async findByEventId(eventId: Uuid): Promise<Subscription[]> {
    const { Items } = await this.dynamoService.query({
      TableName: this.tableName,
      IndexName: this.eventIdIndex,
      KeyConditionExpression: '#eventId = :eventId',
      ExpressionAttributeNames: { '#eventId': 'eventId' },
      ExpressionAttributeValues: { ':eventId': eventId.value },
    });

    return (Items ?? []).map(item => this.toEntity(item as SubscriptionItem));
  }

  async findAll(params: {
    userId?: string;
    eventId?: string;
    status?: Status;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    lastEvaluatedKey?: Record<string, unknown>;
  }): Promise<{ items: Subscription[]; lastEvaluatedKey?: string }> {
    const { userId, eventId, status, dateFrom, dateTo, limit = 10, lastEvaluatedKey } = params;

    const exclusiveStartKey =
      lastEvaluatedKey && Object.keys(lastEvaluatedKey).length > 0 ? lastEvaluatedKey : undefined;

    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};
    const filterExpressions: string[] = [];

    const queryParams: QueryCommandInput = {
      TableName: this.tableName,
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
      IndexName: this.statusCreatedAtIndex,
    };

    expressionAttributeNames['#status'] = 'status';
    expressionAttributeValues[':status'] = status ?? Status.ACTIVE;
    let keyCondition = '#status = :status';

    if (dateFrom && dateTo) {
      expressionAttributeNames['#createdAt'] = 'createdAt';
      expressionAttributeValues[':dateFrom'] = dateFrom;
      expressionAttributeValues[':dateTo'] = dateTo;
      keyCondition += ' AND #createdAt BETWEEN :dateFrom AND :dateTo';
    } else if (dateFrom) {
      expressionAttributeNames['#createdAt'] = 'createdAt';
      expressionAttributeValues[':dateFrom'] = dateFrom;
      keyCondition += ' AND #createdAt >= :dateFrom';
    } else if (dateTo) {
      expressionAttributeNames['#createdAt'] = 'createdAt';
      expressionAttributeValues[':dateTo'] = dateTo;
      keyCondition += ' AND #createdAt <= :dateTo';
    }

    queryParams.KeyConditionExpression = keyCondition;

    if (userId) {
      filterExpressions.push('#userId = :userId');
      expressionAttributeNames['#userId'] = 'userId';
      expressionAttributeValues[':userId'] = userId;
    }

    if (eventId) {
      filterExpressions.push('#eventId = :eventId');
      expressionAttributeNames['#eventId'] = 'eventId';
      expressionAttributeValues[':eventId'] = eventId;
    }

    if (filterExpressions.length > 0) {
      queryParams.FilterExpression = filterExpressions.join(' AND ');
    }

    queryParams.ExpressionAttributeNames = expressionAttributeNames;
    queryParams.ExpressionAttributeValues = expressionAttributeValues;

    return this.queryWithPagination(queryParams);
  }

  async findByUserAndEvent(userId: Uuid, eventId: Uuid): Promise<Subscription | null> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: this.userEventIndex,
      KeyConditionExpression: '#userId = :userId AND #eventId = :eventId',
      ExpressionAttributeNames: {
        '#userId': 'userId',
        '#eventId': 'eventId',
      },
      ExpressionAttributeValues: {
        ':userId': userId.value,
        ':eventId': eventId.value,
      },
      Limit: 1,
    };

    const result = await this.dynamoService.query(params);

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return this.toEntity(result.Items[0] as SubscriptionItem);
  }

  private toItem(subscription: Subscription): SubscriptionItem {
    return {
      id: subscription.id.value,
      userId: subscription.userId.value,
      eventId: subscription.eventId.value,
      status: subscription.status,
      createdAt: subscription.createdAt?.toISOString(),
      updatedAt: subscription.updatedAt?.toISOString(),
    };
  }

  private toEntity(item: SubscriptionItem): Subscription {
    return new Subscription({
      id: new Uuid(item.id),
      userId: new Uuid(item.userId),
      eventId: new Uuid(item.eventId),
      status: item.status,
      createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
    });
  }

  private buildUpdateExpression(fields: Record<string, unknown>) {
    const expressionParts: string[] = [];
    const attributeNames: Record<string, string> = {};
    const attributeValues: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined || value === null) continue;

      const attrName = `#${key}`;
      const attrValue = `:${key}`;

      expressionParts.push(`${attrName} = ${attrValue}`);
      attributeNames[attrName] = key;
      attributeValues[attrValue] = value;
    }

    return {
      UpdateExpression: 'SET ' + expressionParts.join(', '),
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: attributeValues,
    };
  }

  private async queryWithPagination(
    params: QueryCommandInput,
  ): Promise<{ items: Subscription[]; lastEvaluatedKey?: string }> {
    const result = await this.dynamoService.query(params);

    const items = (result.Items ?? []).map(item => this.toEntity(item as SubscriptionItem));

    const lastKey =
      result.LastEvaluatedKey && Object.keys(result.LastEvaluatedKey).length > 0
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
        : undefined;

    return { items, lastEvaluatedKey: lastKey };
  }
}
