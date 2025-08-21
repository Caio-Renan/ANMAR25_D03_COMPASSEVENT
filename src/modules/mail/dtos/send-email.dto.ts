import { EmailTemplate } from '@mail/enums/email-templates.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsObject, IsOptional } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ example: ['user@example.com'], description: 'Destination email addresses' })
  @IsArray()
  @IsEmail({}, { each: true })
  to!: string[];

  @ApiProperty({ example: 'example', description: 'Template key' })
  @IsEnum(EmailTemplate)
  template!: EmailTemplate;

  @ApiProperty({
    example: { url: 'https://app.com/verify?token=123' },
    description: 'Template variables (depends on template)',
  })
  @IsObject()
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
