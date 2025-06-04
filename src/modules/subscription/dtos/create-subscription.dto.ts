import { ApiProperty } from '@nestjs/swagger';
import { IsValidUuid } from 'src/common/decorators';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'uuid-user-id', type: String })
  @IsValidUuid()
  userId!: string;

  @ApiProperty({ example: 'uuid-event-id', type: String })
  @IsValidUuid()
  eventId!: string;
}
