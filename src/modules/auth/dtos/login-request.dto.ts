import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPassword } from 'src/common/decorators';

export class LoginRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SenhaComplexa123' })
  @IsPassword()
  password!: string;
}
