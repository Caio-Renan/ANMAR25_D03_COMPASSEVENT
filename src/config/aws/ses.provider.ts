import { SESClient } from '@aws-sdk/client-ses';
import { AWS_CLIENTS } from '@constants/aws.constants';
import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const SESProvider: Provider = {
  provide: AWS_CLIENTS.SES,
  useFactory: (configService: ConfigService) => {
    return new SESClient({
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
