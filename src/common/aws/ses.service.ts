import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { AWS_CLIENTS } from '@constants/aws.constants';
import { AwsErrorMessages } from '@constants/error-messages/aws-error-messages';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface SendEmailPayload {
  to: string[];
  subject: string;
  htmlBody: string;
  textBody?: string;
  cc?: string[];
  bcc?: string[];
  eventId?: string;
  userId?: string;
}

@Injectable()
export class SESService {
  private readonly logger = new Logger(SESService.name);
  private readonly fromEmail: string;

  constructor(
    @Inject(AWS_CLIENTS.SES)
    private readonly sesClient: SESClient,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.fromEmail = this.configService.getOrThrow<string>('aws.ses.fromEmail');
  }

  private generateCalendarLink(eventId: string, userId: string): string {
    const token = this.jwtService.sign(
      { userId, eventId, type: 'calendar-access' },
      { expiresIn: '10m' },
    );

    const globalPrefix = this.configService.get<string>('globalPrefix');

    const appUrl = this.configService.get<string>('appUrl');

    return `${appUrl}/${globalPrefix}/calendar/${eventId}.ics?token=${token}`;
  }

  async sendEmail({
    to,
    subject,
    htmlBody,
    textBody,
    cc,
    bcc,
    eventId,
    userId,
  }: SendEmailPayload): Promise<string> {
    if (!to?.length) {
      throw new Error('Destination email(s) required');
    }

    let finalHtmlBody = htmlBody;
    let finalTextBody = textBody;

    if (eventId && userId) {
      const icsUrl = this.generateCalendarLink(eventId, userId);

      finalHtmlBody += `
        <p>
          <a href="${icsUrl}" 
             style="display:inline-block;padding:10px 16px;background:#2563eb;color:white;border-radius:8px;text-decoration:none;font-weight:600;">
             Add to Calendar
          </a>
        </p>
      `;

      finalTextBody = (finalTextBody ?? '') + `\nAdd to Calendar: ${icsUrl}`;
    }

    try {
      const command = new SendEmailCommand({
        Source: this.fromEmail,
        Destination: { ToAddresses: to, CcAddresses: cc, BccAddresses: bcc },
        Message: {
          Subject: { Data: subject },
          Body: {
            Html: { Data: finalHtmlBody },
            ...(finalTextBody && { Text: { Data: finalTextBody } }),
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
