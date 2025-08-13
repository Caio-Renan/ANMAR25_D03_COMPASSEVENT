import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { AWS_CLIENTS } from '@constants/aws.constants';
import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const DynamoProvider: Provider = {
  provide: AWS_CLIENTS.DYNAMO_DOCUMENT,
  useFactory: (configService: ConfigService) => {
    const isDev = configService.get<string>('nodeEnv') === 'development';

    const clientConfig: DynamoDBClientConfig = {
      region: configService.get<string>('aws.region') || 'us-east-1',
      credentials: isDev
        ? {
            accessKeyId: 'fakeMyKeyId',
            secretAccessKey: 'fakeSecretAccessKey',
          }
        : {
            accessKeyId: configService.getOrThrow<string>('aws.accessKeyId'),
            secretAccessKey: configService.getOrThrow<string>('aws.secretAccessKey'),
            sessionToken: configService.get<string>('aws.sessionToken'),
          },
      ...(isDev && {
        endpoint: configService.getOrThrow<string>('dynamodb.endpoint'),
      }),
    };

    const client = new DynamoDBClient(clientConfig);

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
