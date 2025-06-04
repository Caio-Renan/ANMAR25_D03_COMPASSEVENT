import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { AWS_CLIENTS } from '../constants/aws.constants';
import { AwsErrorMessages } from '../constants/error-messages/aws-error-messages';

@Injectable()
export class DynamoService {
  private readonly logger = new Logger(DynamoService.name);

  constructor(
    @Inject(AWS_CLIENTS.DYNAMO_DOCUMENT)
    public readonly dynamoClient: DynamoDBDocumentClient,
  ) {}

  async get(params: GetCommand['input']) {
    try {
      const result = await this.dynamoClient.send(new GetCommand(params));
      return result.Item;
    } catch (error) {
      this.logger.error(AwsErrorMessages.DYNAMO_DB.GET_ERROR, error);
      throw error;
    }
  }

  async put(params: PutCommand['input']) {
    try {
      await this.dynamoClient.send(new PutCommand(params));
    } catch (error) {
      this.logger.error(AwsErrorMessages.DYNAMO_DB.PUT_ERROR, error);
      throw error;
    }
  }

  async query(params: QueryCommand['input']) {
    const result = await this.dynamoClient.send(new QueryCommand(params));
    return {
      Items: result.Items || [],
      LastEvaluatedKey: result.LastEvaluatedKey,
    };
  }

  async delete(params: DeleteCommand['input']) {
    try {
      await this.dynamoClient.send(new DeleteCommand(params));
    } catch (error) {
      this.logger.error(AwsErrorMessages.DYNAMO_DB.DELETE_ERROR, error);
      throw error;
    }
  }

  async update(params: UpdateCommand['input']) {
    try {
      await this.dynamoClient.send(new UpdateCommand(params));
    } catch (error) {
      this.logger.error(AwsErrorMessages.DYNAMO_DB.UPDATE_ERROR, error);
      throw error;
    }
  }
}
