import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { DynamoService } from 'common/aws/dynamo.service';
import { Roles } from 'common/enums/roles.enum';
import { Status } from 'common/enums/status.enum';
import { Email, Name, Password, PhoneNumber, Uuid } from 'common/value-objects';

import { User } from '../entities/user.entity';
import { UserItem } from '../interfaces/user.interface';

@Injectable()
export class UserRepository {
  private readonly tableName = 'Users';
  private readonly emailIndex = 'email-index';
  private readonly roleIndex = 'role-id-index';
  private readonly statusIndex = 'status-id-index';

  constructor(private readonly dynamoService: DynamoService) {}

  async create(user: User): Promise<void> {
    await this.dynamoService.put({
      TableName: this.tableName,
      Item: this.toItem(user),
    });
  }

  async update(user: User): Promise<void> {
    const fieldsToUpdate: Record<string, unknown> = {
      name: user.name?.value,
      email: user.email?.value,
      password: user.password?.value,
      phone: user.phone?.value,
      role: user.role,
      status: user.status,
      updatedAt: user.updatedAt?.toISOString(),
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
      Key: { id: user.id.value },
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

  async findById(id: Uuid): Promise<User | null> {
    const result = await this.dynamoService.get({
      TableName: this.tableName,
      Key: { id: id.value },
    });

    return result ? this.toEntity(result as UserItem) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const { Items } = await this.dynamoService.query({
      TableName: this.tableName,
      IndexName: this.emailIndex,
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email.value },
      Limit: 1,
    });

    if (!Items || Items.length === 0) return null;

    return this.toEntity(Items[0] as UserItem);
  }

  async findAll(params: {
    name?: string;
    email?: string;
    status?: Status;
    role?: Roles;
    limit?: number;
    lastEvaluatedKey?: Record<string, unknown>;
  }): Promise<{ items: User[]; lastEvaluatedKey?: string }> {
    const { name, email, status, role, limit = 10, lastEvaluatedKey } = params;

    const exclusiveStartKey =
      lastEvaluatedKey && Object.keys(lastEvaluatedKey).length > 0 ? lastEvaluatedKey : undefined;

    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};
    const filterExpressions: string[] = [];

    const queryParams: QueryCommandInput = {
      TableName: this.tableName,
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
    };

    function setKeyCondition(keyName: string, keyValue: unknown) {
      queryParams.KeyConditionExpression = `#${keyName} = :${keyName}`;
      expressionAttributeNames[`#${keyName}`] = keyName;
      expressionAttributeValues[`:${keyName}`] = keyValue;
    }

    if (role) {
      queryParams.IndexName = this.roleIndex;
      setKeyCondition('role', role);

      if (status) {
        filterExpressions.push('#status = :status');
        expressionAttributeNames['#status'] = 'status';
        expressionAttributeValues[':status'] = status;
      } else {
        filterExpressions.push('#status = :status');
        expressionAttributeNames['#status'] = 'status';
        expressionAttributeValues[':status'] = Status.ACTIVE;
      }
    } else if (status) {
      queryParams.IndexName = this.statusIndex;
      setKeyCondition('status', status);
    } else {
      queryParams.IndexName = this.statusIndex;
      setKeyCondition('status', Status.ACTIVE);
    }

    if (name) {
      filterExpressions.push('contains(#name, :name)');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = name;
    }

    if (email) {
      filterExpressions.push('contains(#email, :email)');
      expressionAttributeNames['#email'] = 'email';
      expressionAttributeValues[':email'] = email;
    }

    if (!queryParams.KeyConditionExpression && role) {
      filterExpressions.push('#role = :role');
      expressionAttributeNames['#role'] = 'role';
      expressionAttributeValues[':role'] = role;
    }

    if (filterExpressions.length > 0) {
      queryParams.FilterExpression = filterExpressions.join(' AND ');
    }

    queryParams.ExpressionAttributeNames = expressionAttributeNames;
    queryParams.ExpressionAttributeValues = expressionAttributeValues;

    return this.queryWithPagination(queryParams);
  }

  private toItem(user: User): UserItem {
    return {
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
      password: user.password.value,
      phone: user.phone.value,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    };
  }

  private toEntity(item: UserItem): User {
    return new User({
      id: new Uuid(item.id),
      name: new Name(item.name),
      email: new Email(item.email),
      password: new Password(item.password),
      phone: new PhoneNumber(item.phone),
      role: item.role as Roles,
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
  ): Promise<{ items: User[]; lastEvaluatedKey?: string }> {
    const result = await this.dynamoService.query(params);

    const items = (result.Items ?? []).map(item => this.toEntity(item as UserItem));

    const lastKey =
      result.LastEvaluatedKey && Object.keys(result.LastEvaluatedKey).length > 0
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
        : undefined;

    return { items, lastEvaluatedKey: lastKey };
  }
}
