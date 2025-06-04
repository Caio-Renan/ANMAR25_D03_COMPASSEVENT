import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { DynamoService } from 'src/common/aws/dynamo.service';
import { Status } from 'src/common/enums/status.enum';
import { GenericDate, GenericString, Uuid } from 'src/common/value-objects';

import { Event } from '../entities/event.entity';
import { EventItem } from '../interfaces/event.interface';

@Injectable()
export class EventRepository {
  private readonly tableName = 'Events';
  private readonly nameIndex = 'name-id-index';
  private readonly statusDateIndex = 'status-date-index';

  constructor(private readonly dynamoService: DynamoService) {}

  async create(event: Event): Promise<void> {
    await this.dynamoService.put({
      TableName: this.tableName,
      Item: this.toItem(event),
    });
  }

  async update(event: Event): Promise<void> {
    const fieldsToUpdate: Record<string, unknown> = {
      name: event.name?.value,
      description: event.description?.value,
      date: event.date?.value.toISOString(),
      organizerId: event.organizerId?.value,
      status: event.status,
      updatedAt: event.updatedAt?.toISOString(),
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
      Key: { id: event.id.value },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    });
  }

  async softDelete(id: Uuid): Promise<void> {
    await this.dynamoService.update({
      TableName: this.tableName,
      Key: { id: id.value },
      UpdateExpression: 'SET #status = :deleted',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':deleted': Status.INACTIVE },
    });
  }

  async findById(id: Uuid): Promise<Event | null> {
    const result = await this.dynamoService.get({
      TableName: this.tableName,
      Key: { id: id.value },
    });

    return result ? this.toEntity(result as EventItem) : null;
  }

  async findByName(name: GenericString): Promise<Event | null> {
    const { Items } = await this.dynamoService.query({
      TableName: this.tableName,
      IndexName: this.nameIndex,
      KeyConditionExpression: '#name = :name',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: { ':name': name.value },
      Limit: 1,
    });

    if (!Items || Items.length === 0) return null;

    return this.toEntity(Items[0] as EventItem);
  }

  async findAll(params: {
    name?: string;
    status?: Status;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    lastEvaluatedKey?: Record<string, unknown>;
  }): Promise<{ items: Event[]; lastEvaluatedKey?: string }> {
    const { name, status, dateFrom, dateTo, limit = 10, lastEvaluatedKey } = params;

    const exclusiveStartKey =
      lastEvaluatedKey && Object.keys(lastEvaluatedKey).length > 0 ? lastEvaluatedKey : undefined;

    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};
    const filterExpressions: string[] = [];

    const queryParams: QueryCommandInput = {
      TableName: this.tableName,
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
      IndexName: this.statusDateIndex,
    };

    function setKeyCondition(expression: string) {
      queryParams.KeyConditionExpression = expression;
    }

    expressionAttributeNames['#status'] = 'status';
    expressionAttributeValues[':status'] = status ?? Status.ACTIVE;

    let keyCondition = '#status = :status';

    if (dateFrom && dateTo) {
      expressionAttributeNames['#date'] = 'date';
      expressionAttributeValues[':dateFrom'] = dateFrom;
      expressionAttributeValues[':dateTo'] = dateTo;

      keyCondition += ' AND #date BETWEEN :dateFrom AND :dateTo';
    } else if (dateFrom) {
      expressionAttributeNames['#date'] = 'date';
      expressionAttributeValues[':dateFrom'] = dateFrom;

      keyCondition += ' AND #date >= :dateFrom';
    } else if (dateTo) {
      expressionAttributeNames['#date'] = 'date';
      expressionAttributeValues[':dateTo'] = dateTo;

      keyCondition += ' AND #date <= :dateTo';
    }

    setKeyCondition(keyCondition);

    if (name) {
      filterExpressions.push('contains(#name, :name)');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = name;
    }

    if (filterExpressions.length > 0) {
      queryParams.FilterExpression = filterExpressions.join(' AND ');
    }

    queryParams.ExpressionAttributeNames = expressionAttributeNames;
    queryParams.ExpressionAttributeValues = expressionAttributeValues;

    return this.queryWithPagination(queryParams);
  }

  private toItem(event: Event): EventItem {
    return {
      id: event.id.value,
      name: event.name.value,
      description: event.description.value,
      date: event.date.value.toISOString(),
      organizerId: event.organizerId.value,
      status: event.status,
      createdAt: event.createdAt?.toISOString(),
      updatedAt: event.updatedAt?.toISOString(),
    };
  }

  private toEntity(item: EventItem): Event {
    return new Event({
      id: new Uuid(item.id),
      name: new GenericString(item.name),
      description: new GenericString(item.description),
      date: new GenericDate(item.date),
      organizerId: new Uuid(item.organizerId),
      status: item.status as Status,
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
  ): Promise<{ items: Event[]; lastEvaluatedKey?: string }> {
    const result = await this.dynamoService.query(params);

    const items = (result.Items ?? []).map(item => this.toEntity(item as EventItem));

    const lastKey =
      result.LastEvaluatedKey && Object.keys(result.LastEvaluatedKey).length > 0
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
        : undefined;

    return { items, lastEvaluatedKey: lastKey };
  }
}
