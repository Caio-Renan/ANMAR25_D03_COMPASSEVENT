import { EmailTemplate } from '@app/modules/mail/enums/email-templates.enum';
import { EmailService } from '@app/modules/mail/services/email.service';
import { EmailTokenService } from '@app/modules/mail/services/email-token.service';
import { UserService } from '@app/modules/user/services/user.service';
import { LoginRequestDto } from '@auth/dtos/login-request.dto';
import { LoginResponseDto } from '@auth/dtos/login-response.dto';
import { PasswordResetDto } from '@auth/dtos/password-reset.dto';
import { PasswordResetRequestDto } from '@auth/dtos/password-reset-request.dto';
import { PasswordResetRequestResponseDto } from '@auth/dtos/password-reset-request-response.dto';
import { PasswordResetResponseDto } from '@auth/dtos/password-reset-response.dto';
import { VerifyEmailDto } from '@auth/dtos/verify-email.dto';
import { VerifyEmailResponseDto } from '@auth/dtos/verify-email-response.dto';
import { AuthService } from '@auth/services/auth.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Email, Password } from '@vo/index';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailTokenService: EmailTokenService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify user email using token' })
  @ApiQuery({ name: 'token', description: 'Email verification token', type: String })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    type: VerifyEmailResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<VerifyEmailResponseDto> {
    const payload = this.emailTokenService.verifyEmailVerificationToken(dto.token);

    const emailVo = new Email(payload.email);

    await this.userService.activateUserByEmail(emailVo);

    return { message: 'Email verified successfully', email: payload.email };
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return JWT token' })
  @ApiResponse({ status: 201, description: 'User logged in successfully', type: LoginResponseDto })
  async login(@Body() dto: LoginRequestDto) {
    const emailVo = new Email(dto.email);
    const passwordVo = new Password(dto.password);
    const user = await this.authService.validateUser(emailVo, passwordVo);
    return this.authService.login(user);
  }

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Send password reset email to user' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
    type: PasswordResetRequestResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async requestPasswordReset(@Body() dto: PasswordResetRequestDto) {
    const emailVo = new Email(dto.email);

    const user = await this.userService.validateUserByEmail(emailVo);

    const globalPrefix = this.configService.get<string>('globalPrefix');
    const appUrl = this.configService.get<string>('appUrl');

    const token = this.emailTokenService.generatePasswordResetToken(user.id.toString());
    const resetLink = `${appUrl}/${globalPrefix}/reset-password?token=${token}`;

    await this.emailService.sendEmail({
      to: [user.email.toString()],
      template: EmailTemplate.PASSWORD_RESET,
      variables: { url: resetLink },
    });

    return { message: 'Password reset email sent' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password using token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: PasswordResetResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resetPassword(@Body() dto: PasswordResetDto): Promise<PasswordResetResponseDto> {
    const payload = this.emailTokenService.verifyPasswordResetToken(dto.token);
    const user = await this.userService.validateUserByUuid(payload.userId);

    return this.userService.generateNewPassword(user, dto.newPassword);
  }
}
