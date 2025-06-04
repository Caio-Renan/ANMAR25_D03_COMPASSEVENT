import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AWS_CLIENTS } from '../../common/constants/aws.constants';

export const DynamoProvider: Provider = {
  provide: AWS_CLIENTS.DYNAMO_DOCUMENT,
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
