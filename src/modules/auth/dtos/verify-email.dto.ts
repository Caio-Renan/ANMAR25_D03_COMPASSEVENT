import { IsGenericString } from '@app/common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'token123', description: 'Email verification token' })
  @IsGenericString()
  token!: string;
}
