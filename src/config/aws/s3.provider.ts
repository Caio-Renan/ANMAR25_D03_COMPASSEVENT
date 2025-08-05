import { S3Client } from '@aws-sdk/client-s3';
import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWS_CLIENTS } from 'common/constants/aws.constants';

export const S3Provider: Provider = {
  provide: AWS_CLIENTS.S3,
  useFactory: (configService: ConfigService) => {
    return new S3Client({
      region: configService.getOrThrow<string>('aws.region'),
      credentials: {
        accessKeyId: configService.getOrThrow<string>('aws.accessKeyId'),
        secretAccessKey: configService.getOrThrow<string>('aws.secretAccessKey'),
      },
    });
  },
  inject: [ConfigService],
};
