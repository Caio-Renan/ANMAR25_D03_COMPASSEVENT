import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@user/entities/user.entity';
import { UserService } from '@user/services/user.service';
import { Email, Password } from '@vo/index';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: Email, password: Password) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password.value, user.password.value);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password incorrect');
    }

    return user;
  }

  async login(user: User) {
    const payload: JwtPayload = {
      sub: user.id.value,
      email: user.email.value,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
