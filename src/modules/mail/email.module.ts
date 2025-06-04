import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { EmailController } from './controllers/email.controller';
import { EmailService } from './services/email.service';
import { EmailTokenService } from './services/email-token.service';
import { MailTemplateService } from './services/mail-template.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('jwt.secret'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailTokenService, MailTemplateService],
  exports: [EmailService, EmailTokenService, MailTemplateService],
})
export class EmailModule {}
