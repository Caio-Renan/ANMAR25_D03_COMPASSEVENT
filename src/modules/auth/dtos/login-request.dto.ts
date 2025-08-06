import { IsEmail, IsPassword } from '@decorators/index';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SenhaComplexa123' })
  @IsPassword()
  password!: string;
}
