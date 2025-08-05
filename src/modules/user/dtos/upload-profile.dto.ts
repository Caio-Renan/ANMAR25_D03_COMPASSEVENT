import { ApiProperty } from '@nestjs/swagger';
import { IsBase64Image } from 'common/decorators';
export class UploadProfileImageDto {
  @ApiProperty({
    description: 'Base64 encoded image',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
  })
  @IsBase64Image()
  base64Image!: string;
}
