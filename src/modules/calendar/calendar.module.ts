import { SESService } from '@common/aws/ses.service';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { EventModule } from '../event/event.module';
import { EmailModule } from '../mail/email.module';
import { CalendarController } from './controllers/calendar.controller';
import { CalendarTokenGuard } from './guards/calendar-token.guard';
import { CalendarService } from './services/calendar.service';
import { CalendarEmailService } from './services/calendar-email.service';
import { CalendarTokenService } from './services/calendar-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'default_secret',
        signOptions: { expiresIn: '10m' },
      }),
    }),
    forwardRef(() => EventModule),
    forwardRef(() => EmailModule),
  ],
  controllers: [CalendarController],
  providers: [
    CalendarService,
    CalendarTokenService,
    CalendarEmailService,
    CalendarTokenGuard,
    SESService,
  ],
  exports: [CalendarService, CalendarTokenService, CalendarEmailService, CalendarTokenGuard],
})
export class CalendarModule {}
