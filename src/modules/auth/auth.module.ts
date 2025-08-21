import { AuthController } from '@auth/controllers/auth.controller';
import { AuthService } from '@auth/services/auth.service';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@user/user.module';

import { EmailModule } from '../mail/email.module';
import { EmailService } from '../mail/services/email.service';
import { EmailTokenService } from '../mail/services/email-token.service';
import { MailTemplateService } from '../mail/services/mail-template.service';
import { UserRepository } from '../user/repositories/user.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret', { infer: true }),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn', { infer: true }),
        },
      }),
    }),
    UserModule,
    EmailModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UserRepository,
    EmailTokenService,
    EmailService,
    MailTemplateService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
