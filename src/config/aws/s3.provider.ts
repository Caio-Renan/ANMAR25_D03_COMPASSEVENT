import { S3Client } from '@aws-sdk/client-s3';
import { AWS_CLIENTS } from '@constants/aws.constants';
import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const S3Provider: Provider = {
  provide: AWS_CLIENTS.S3,
  useFactory: (configService: ConfigService) => {
    return new S3Client({
      region: configService.getOrThrow<string>('aws.region'),
      credentials: {
        accessKeyId: configService.getOrThrow<string>('aws.accessKeyId'),
        secretAccessKey: configService.getOrThrow<string>('aws.secretAccessKey'),
        sessionToken: configService.get<string>('aws.sessionToken'),
      },
    });
  },
  inject: [ConfigService],
};
