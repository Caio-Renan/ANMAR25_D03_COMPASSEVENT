import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { CalendarTokenService } from '../services/calendar-token.service';

@Injectable()
export class CalendarTokenGuard implements CanActivate {
  constructor(private readonly calendarTokenService: CalendarTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.query.token;

    if (!token) {
      throw new UnauthorizedException('Missing calendar access token');
    }

    try {
      const payload = this.calendarTokenService.verifyToken(token);
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired calendar token');
    }
  }
}
