import { Body, Controller, Post } from '@nestjs/common';
import { Email } from 'common/value-objects/email.vo';
import { Password } from 'common/value-objects/password.vo';

import { LoginRequestDto } from '../dtos/login-request.dto';
import { AuthService } from '../services/auth.service';

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
