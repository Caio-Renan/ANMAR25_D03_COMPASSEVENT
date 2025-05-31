import { ConfigService } from '@nestjs/config';
import type { Provider } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const DynamoProvider: Provider = {
  provide: 'DYNAMODB_DOCUMENT_CLIENT',
  useFactory: (configService: ConfigService) => {
    const client = new DynamoDBClient({
      region: configService.getOrThrow<string>('aws.region'),
      credentials: {
        accessKeyId: configService.getOrThrow<string>('aws.accessKeyId'),
        secretAccessKey: configService.getOrThrow<string>('aws.secretAccessKey'),
      },
      endpoint: configService.get<string>('dynamodb.endpoint'),
    });

    const translateConfig = {
      marshallOptions: {
        removeUndefinedValues: true,
      },
      unmarshallOptions: {
        wrapNumbers: false,
      },
    };

    return DynamoDBDocumentClient.from(client, translateConfig);
  },
  inject: [ConfigService],
};
