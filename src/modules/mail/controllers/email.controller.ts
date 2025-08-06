import { EmailTokenService } from '@mail/services/email-token.service';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

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
