import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AWS_CLIENTS } from '../constants/aws.constants';
import { AwsErrorMessages } from '../constants/error-messages/aws-error-messages';

export interface SendEmailPayload {
  to: string[];
  subject: string;
  htmlBody: string;
  textBody?: string;
  cc?: string[];
  bcc?: string[];
}

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

  async sendEmail({ to, subject, htmlBody, textBody, cc, bcc }: SendEmailPayload): Promise<string> {
    if (!to?.length) {
      throw new Error('Destination email(s) required');
    }

    try {
      const command = new SendEmailCommand({
        Source: this.fromEmail,
        Destination: {
          ToAddresses: to,
          CcAddresses: cc,
          BccAddresses: bcc,
        },
        Message: {
          Subject: { Data: subject },
          Body: {
            Html: { Data: htmlBody },
            ...(textBody && { Text: { Data: textBody } }),
          },
        },
      });

      const response = await this.sesClient.send(command);
      this.logger.log(
        `Email sent to ${to.join(', ')} with subject "${subject}". MessageId: ${response.MessageId}`,
      );

      return response.MessageId ?? '';
    } catch (error) {
      this.logger.error(AwsErrorMessages.SES.SEND_EMAIL_ERROR(to, subject), error as Error);
      throw error;
    }
  }
}
