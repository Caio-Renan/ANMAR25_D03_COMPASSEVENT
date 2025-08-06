import { Status } from '@enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Subscription } from '@subscription/entities/subscription.entity';

export class SubscriptionResponseDto {
  @ApiProperty({ example: 'uuid-v4-string' })
  id!: string;

  @ApiProperty({ example: 'uuid-user-id' })
  userId!: string;

  @ApiProperty({ example: 'uuid-event-id' })
  eventId!: string;

  @ApiProperty({ enum: Status, example: Status.ACTIVE })
  status!: Status;

  @ApiProperty({ example: '2025-06-02T18:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2025-06-02T18:05:00.000Z' })
  updatedAt!: string;

  constructor(subscription: Subscription) {
    this.id = subscription.id.value;
    this.userId = subscription.userId.value;
    this.eventId = subscription.eventId.value;
    this.status = subscription.status;
    this.createdAt = subscription.createdAt?.toISOString();
    this.updatedAt = subscription.updatedAt?.toISOString();
  }
}
