import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
  @ApiProperty({ example: 'Email verified successfully' })
  message!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;
}
