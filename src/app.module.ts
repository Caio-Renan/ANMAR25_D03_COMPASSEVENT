import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { AllExceptionsFilter } from './common/exceptions';
import { LoggerModule } from './common/logger/logger.module';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { EventModule } from './modules/event/event.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [
    UserModule,
    EventModule,
    SubscriptionModule,
    LoggerModule,
    AuthModule,
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
