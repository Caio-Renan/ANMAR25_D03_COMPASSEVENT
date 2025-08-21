import { SESService } from '@aws/ses.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CalendarTokenService } from './calendar-token.service';

@Injectable()
export class CalendarEmailService {
  private readonly logger = new Logger(CalendarEmailService.name);

  constructor(
    private readonly sesService: SESService,
    private readonly calendarTokenService: CalendarTokenService,
    private readonly configService: ConfigService,
  ) {}

  async sendSubscriptionConfirmation(
    user: { id: string; email: string; name: string },
    event: { id: string; title: string },
  ) {
    const token = this.calendarTokenService.generateToken(user.id, event.id);

    const globalPrefix = this.configService.get<string>('globalPrefix');

    const appUrl = this.configService.get<string>('appUrl');

    const link = `${appUrl}/${globalPrefix}/calendar/${event.id}.ics?token=${token}`;

    const subject = `Subscription confirmed: ${event.title}`;
    const htmlBody = `
      <p>Hello ${user.name},</p>
      <p>Your subscription to the event <strong>${event.title}</strong> has been confirmed!</p>
      <p>Click the button below to add the event to your calendar:</p>
    `;
    const textBody = `Hello ${user.name},\n\nYour subscription to the event ${event.title} has been confirmed!\nAdd to your calendar: ${link}`;

    try {
      const messageId = await this.sesService.sendEmail({
        to: [user.email],
        subject,
        htmlBody,
        textBody,
        eventId: event.id,
        userId: user.id,
      });
      this.logger.log(
        `Subscription confirmation email sent to ${user.email} for event ${event.title}. MessageId: ${messageId}`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to send subscription confirmation to ${user.email} for event ${event.title}`,
        err as Error,
      );
    }
  }
}
