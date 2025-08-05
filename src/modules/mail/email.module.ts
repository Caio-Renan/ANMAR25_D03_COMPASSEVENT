import { EmailController } from '@mail/controllers/email.controller';
import { EmailService } from '@mail/services/email.service';
import { EmailTokenService } from '@mail/services/email-token.service';
import { MailTemplateService } from '@mail/services/mail-template.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

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
