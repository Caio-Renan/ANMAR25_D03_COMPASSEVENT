import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetRequestResponseDto {
  @ApiProperty({ example: 'Password reset email sent' })
  message!: string;
}
