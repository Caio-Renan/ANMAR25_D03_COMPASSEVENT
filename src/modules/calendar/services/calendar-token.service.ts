import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CalendarTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(userId: string, eventId: string): string {
    return this.jwtService.sign({ sub: userId, eventId });
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
