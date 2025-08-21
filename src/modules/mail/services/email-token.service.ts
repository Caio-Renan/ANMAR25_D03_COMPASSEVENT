import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Email, Uuid } from '@vo/index';

import { EmailTemplate } from '../enums/email-templates.enum';

@Injectable()
export class EmailTokenService {
  constructor(private readonly jwt: JwtService) {}

  generateEmailVerificationToken(email: Email): string {
    return this.jwt.sign({ email: email.toString() });
  }

  verifyEmailVerificationToken(token: string): { email: string } {
    try {
      return this.jwt.verify<{ email: string }>(token);
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  generatePasswordResetToken(userId: Uuid | string): string {
    const id = typeof userId === 'string' ? userId : userId.value;
    return this.jwt.sign({ userId: id, type: EmailTemplate.PASSWORD_RESET }, { expiresIn: '1h' });
  }

  verifyPasswordResetToken(token: string): { userId: Uuid } {
    try {
      const payload = this.jwt.verify<{ userId: string; type?: string }>(token);

      if (payload.type !== EmailTemplate.PASSWORD_RESET) {
        throw new BadRequestException('Invalid token type');
      }

      return { userId: new Uuid(payload.userId) };
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
