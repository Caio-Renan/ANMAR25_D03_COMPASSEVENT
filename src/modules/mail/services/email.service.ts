import { SESService } from '@aws/ses.service';
import { SendEmailDto } from '@mail/dtos/send-email.dto';
import { MailTemplateService } from '@mail/services/mail-template.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(
    private readonly templateService: MailTemplateService,
    private readonly sesService: SESService,
  ) {}

  async sendEmail(dto: SendEmailDto): Promise<string> {
    const { to, cc, bcc, template, variables } = dto;

    const { subject, html, text } = this.templateService.getTemplate(template, variables);

    return this.sesService.sendEmail({
      to,
      subject,
      htmlBody: html,
      textBody: text,
      cc,
      bcc,
    });
  }
}
