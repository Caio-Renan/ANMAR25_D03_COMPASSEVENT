import { Injectable } from '@nestjs/common';

@Injectable()
export class MailTemplateService {
  buildEmailVerificationTemplate(link: string) {
    const html = `
      <h1>Verify your email</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${link}">${link}</a>
    `;
    const text = `Verify your email by visiting this link: ${link}`;
    return { subject: 'Verify your email', html, text };
  }

  buildGenericTemplate(title: string, message: string) {
    const html = `
      <h1>${title}</h1>
      <p>${message}</p>
    `;
    const text = `${title}\n\n${message}`;
    return { subject: title, html, text };
  }
}
