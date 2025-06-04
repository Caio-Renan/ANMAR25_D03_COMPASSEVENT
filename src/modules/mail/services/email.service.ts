import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AWS_CLIENTS } from '../../../common/constants/aws.constants';
import { MailTemplateService } from './mail-template.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly enabled: boolean;

  constructor(
    @Inject(AWS_CLIENTS.SES)
    private readonly sesClient: SESClient,
    private readonly configService: ConfigService,
    private readonly mailTemplateService: MailTemplateService,
  ) {
    this.fromEmail = this.configService.getOrThrow<string>('aws.ses.fromEmail');

    const accessKey = this.configService.get<string>('aws.accessKeyId');
    const secretKey = this.configService.get<string>('aws.secretAccessKey');
    this.enabled = !!(accessKey && secretKey && this.fromEmail);

    if (!this.enabled) {
      this.logger.warn('SES is disabled. Emails will not be sent.');
    }
  }

  async sendEmail(
    to: string[],
    subject: string,
    htmlBody: string,
    textBody?: string,
    attachments?: { filename: string; content: string }[],
  ) {
    if (!this.enabled) {
      this.logger.warn(`Email to ${to.join(',')} not sent. SES is disabled.`);
      return;
    }

    try {
      const command = new SendEmailCommand({
        Source: this.fromEmail,
        Destination: {
          ToAddresses: to,
        },
        Message: {
          Subject: { Data: subject },
          Body: {
            Html: { Data: htmlBody },
            ...(textBody && { Text: { Data: textBody } }),
          },
        },
      });

      await this.sesClient.send(command);
      this.logger.log(`Email sent to ${to.join(', ')}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to.join(', ')} with subject "${subject}"`,
        error as Error,
      );
      throw error;
    }
  }
}
