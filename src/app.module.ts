import { AuthModule } from '@auth/auth.module';
import configuration from '@config/configuration';
import { EventModule } from '@event/event.module';
import { AllExceptionsFilter } from '@exceptions/index';
import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { SubscriptionModule } from '@subscription/subscription.module';
import { UserModule } from '@user/user.module';

import { CalendarModule } from './modules/calendar/calendar.module';
import { EmailModule } from './modules/mail/email.module';
@Module({
  imports: [
    UserModule,
    EventModule,
    SubscriptionModule,
    LoggerModule,
    AuthModule,
    CalendarModule,
    EmailModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], envFilePath: '.env' }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
