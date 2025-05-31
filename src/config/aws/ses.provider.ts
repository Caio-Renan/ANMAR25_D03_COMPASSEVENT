import { SESClient } from '@aws-sdk/client-ses';
import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const SESProvider: Provider = {
  provide: 'SES_CLIENT',
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
