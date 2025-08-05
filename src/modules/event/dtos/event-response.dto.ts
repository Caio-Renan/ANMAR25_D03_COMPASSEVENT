import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'common/enums/status.enum';

import { Event } from '../entities/event.entity';

export class EventResponseDto {
  @ApiProperty({ example: 'uuid-v4-string' })
  id!: string;

  @ApiProperty({ example: 'Tech Conference 2025' })
  name!: string;

  @ApiProperty({ example: 'A conference about technology trends.' })
  description!: string;

  @ApiProperty({ example: '2025-08-15T14:00:00.000Z' })
  date!: string;

  @ApiProperty({ example: 'uuid-organizer-id' })
  organizerId!: string;

  @ApiProperty({ enum: Status, example: Status.ACTIVE })
  status!: Status;

  @ApiProperty({ example: '2025-06-02T18:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2025-06-02T18:05:00.000Z' })
  updatedAt!: string;

  constructor(event: Event) {
    this.id = event.id.value;
    this.name = event.name.value;
    this.description = event.description.value;
    this.date = event.date.value.toISOString();
    this.organizerId = event.organizerId.value;
    this.status = event.status;
    this.createdAt = event.createdAt?.toISOString();
    this.updatedAt = event.updatedAt?.toISOString();
  }
}
