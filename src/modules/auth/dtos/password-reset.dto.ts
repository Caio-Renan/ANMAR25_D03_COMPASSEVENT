import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class PasswordResetDto {
  @ApiProperty({ example: 'token123', description: 'Password reset token' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'NovaSenha123!', description: 'New password for the user' })
  @MinLength(6)
  newPassword!: string;
}
