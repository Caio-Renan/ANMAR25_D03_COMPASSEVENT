import { IsBase64Image } from '@decorators/index';
import { ApiProperty } from '@nestjs/swagger';
export class UploadProfileImageDto {
  @ApiProperty({
    description: 'Base64 encoded image',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
  })
  @IsBase64Image()
  base64Image!: string;
}
