import type { Provider } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { awsConfig } from './aws.config';

const dynamoDbClient = new DynamoDBClient({
  region: awsConfig.region || 'us-east-1',
  credentials: {
    accessKeyId: awsConfig.accessKeyId || '',
    secretAccessKey: awsConfig.secretAccessKey || '',
  },
  endpoint: awsConfig.dynamoEndpoint,
});

const marshallOptions = {
  removeUndefinedValues: true,
};

const unmarshallOptions = {
  wrapNumbers: false,
};

const translateConfig = { marshallOptions, unmarshallOptions };

export const DynamoProvider: Provider = {
  provide: 'DYNAMODB_DOCUMENT_CLIENT',
  useValue: DynamoDBDocumentClient.from(dynamoDbClient, translateConfig),
};
