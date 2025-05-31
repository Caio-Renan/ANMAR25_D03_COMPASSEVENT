import { Injectable, Inject, Logger } from '@nestjs/common';
import type { SESClient } from '@aws-sdk/client-ses';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import type { ConfigService } from '@nestjs/config';
import { AWS_CLIENTS } from '../constants/aws.constants';
import { AwsErrorMessages } from '../constants/error-messages/aws-error-messages';

@Injectable()
export class SESService {
  private readonly logger = new Logger(SESService.name);
  private readonly fromEmail: string;

  constructor(
    @Inject(AWS_CLIENTS.SES)
    private readonly sesClient: SESClient,
    private readonly configService: ConfigService,
  ) {
    this.fromEmail = this.configService.getOrThrow<string>('aws.ses.fromEmail');
  }

  async sendEmail(to: string[], subject: string, htmlBody: string, textBody?: string) {
    try {
      const command = new SendEmailCommand({
        Source: this.fromEmail,
        Destination: {
          ToAddresses: to,
        },
        Message: {
          Subject: {
            Data: subject,
          },
          Body: {
            Html: {
              Data: htmlBody,
            },
            ...(textBody && {
              Text: {
                Data: textBody,
              },
            }),
          },
        },
      });

      await this.sesClient.send(command);
    } catch (error) {
      this.logger.error(AwsErrorMessages.SES.SEND_EMAIL_ERROR, error as Error);
      throw error;
    }
  }
}
