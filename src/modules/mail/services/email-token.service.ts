import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmailTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateEmailVerificationToken(payload: { email: string }) {
    return this.jwtService.sign(payload, {
      expiresIn: '1d',
    });
  }

  verifyEmailVerificationToken(token: string): { email: string } {
    return this.jwtService.verify<{ email: string }>(token);
  }
}
