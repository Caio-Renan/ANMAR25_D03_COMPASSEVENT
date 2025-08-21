import { IsEmail } from '@decorators/index';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetRequestDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email to send reset link' })
  @IsEmail()
  email!: string;
}
