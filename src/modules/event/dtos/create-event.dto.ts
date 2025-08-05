import { ApiProperty } from '@nestjs/swagger';
import { IsGenericDate, IsGenericString, IsValidUuid } from 'common/decorators';

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Conference 2025', type: String })
  @IsGenericString()
  name!: string;

  @ApiProperty({ example: 'A conference about technology trends.', type: String })
  @IsGenericString()
  description!: string;

  @ApiProperty({ example: '2025-08-15T14:00:00.000Z', type: String })
  @IsGenericDate()
  date!: string;

  @ApiProperty({ example: 'uuid-organizer-id', type: String })
  @IsValidUuid()
  organizerId!: string;
}
