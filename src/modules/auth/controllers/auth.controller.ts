import { LoginRequestDto } from '@auth/dtos/login-request.dto';
import { AuthService } from '@auth/services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { Email } from '@vo/email.vo';
import { Password } from '@vo/password.vo';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginRequestDto) {
    const emailVO = new Email(dto.email);
    const passwordVO = new Password(dto.password);
    const user = await this.authService.validateUser(emailVO, passwordVO);
    return this.authService.login(user);
  }
}
