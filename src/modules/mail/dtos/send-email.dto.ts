import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

import { EmailTemplate } from '../enums/email-templates.enum';

export class SendEmailDto {
  @ApiProperty({ example: ['user@example.com'], description: 'Destination email addresses' })
  @IsArray()
  @IsEmail({}, { each: true })
  to!: string[];

  @ApiProperty({ example: 'Welcome!', description: 'Email subject' })
  @IsString()
  subject!: string;

  @ApiProperty({ example: 'example', description: 'Template key' })
  @IsEnum(EmailTemplate)
  template!: EmailTemplate;

  @ApiProperty({ example: { name: 'John' }, description: 'Template variables' })
  variables!: Record<string, unknown>;

  @ApiProperty({ example: ['cc@example.com'], required: false })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  cc?: string[];

  @ApiProperty({ example: ['bcc@example.com'], required: false })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  bcc?: string[];
}
