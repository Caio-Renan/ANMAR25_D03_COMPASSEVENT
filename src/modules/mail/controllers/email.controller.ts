import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

import { EmailTokenService } from '../services/email-token.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailTokenService: EmailTokenService) {}

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    try {
      const payload = this.emailTokenService.verifyEmailVerificationToken(token);
      return {
        message: 'Email verified successfully',
        email: payload.email,
      };
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
