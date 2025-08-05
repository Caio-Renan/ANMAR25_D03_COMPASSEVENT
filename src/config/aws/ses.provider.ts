import { SESClient } from '@aws-sdk/client-ses';
import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWS_CLIENTS } from 'common/constants/aws.constants';

export const SESProvider: Provider = {
  provide: AWS_CLIENTS.SES,
  useFactory: (configService: ConfigService) => {
    return new SESClient({
      region: configService.getOrThrow<string>('aws.ses.region'),
      credentials: {
        accessKeyId: configService.getOrThrow<string>('aws.accessKeyId'),
        secretAccessKey: configService.getOrThrow<string>('aws.secretAccessKey'),
      },
    });
  },
  inject: [ConfigService],
};
