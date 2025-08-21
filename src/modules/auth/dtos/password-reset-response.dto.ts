import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetResponseDto {
  @ApiProperty({ example: 'Password reset successfully' })
  message!: string;
}
