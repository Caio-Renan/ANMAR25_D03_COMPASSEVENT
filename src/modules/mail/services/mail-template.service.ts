import { EmailTemplate } from '@mail/enums/email-templates.enum';
import { exampleTemplate } from '@mail/templates/example.template';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailTemplateService {
  getTemplate(template: EmailTemplate, variables: Record<string, unknown>) {
    switch (template) {
      case EmailTemplate.EXAMPLE:
        return exampleTemplate(variables as { name: string });

      case EmailTemplate.VERIFY_EMAIL: {
        const { url } = variables as { url: string };
        return {
          subject: 'Verify your email',
          html: `<p>Please verify your email by clicking <a href="${url}">here</a>.</p>`,
          text: `Please verify your email: ${url}`,
        };
      }

      case EmailTemplate.PASSWORD_RESET: {
        const { url } = variables as { url: string };
        return {
          subject: 'Reset your password',
          html: `<p>Reset your password by clicking <a href="${url}">here</a>.</p>`,
          text: `Reset your password: ${url}`,
        };
      }

      default:
        throw new Error(`Unknown template: ${template}`);
    }
  }
}
