import { Status } from '@enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Uuid } from '@vo/index';

export class Subscription {
  @ApiProperty({ example: 'uuid-v4-string', type: String })
  id!: Uuid;

  @ApiProperty({ example: 'uuid-user-id', type: String })
  userId!: Uuid;

  @ApiProperty({ example: 'uuid-event-id', type: String })
  eventId!: Uuid;

  @ApiProperty({ enum: Status, example: Status.ACTIVE })
  status!: Status;

  @ApiProperty({ example: '2025-06-02T18:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-06-02T18:05:00.000Z' })
  updatedAt!: Date;

  constructor(props: {
    id: string | Uuid;
    userId: string | Uuid;
    eventId: string | Uuid;
    status: Status;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  }) {
    this.id = props.id instanceof Uuid ? props.id : new Uuid(props.id);
    this.userId = props.userId instanceof Uuid ? props.userId : new Uuid(props.userId);
    this.eventId = props.eventId instanceof Uuid ? props.eventId : new Uuid(props.eventId);
    this.status = props.status;
    this.createdAt =
      props.createdAt instanceof Date
        ? props.createdAt
        : props.createdAt
          ? new Date(props.createdAt)
          : new Date();
    this.updatedAt =
      props.updatedAt instanceof Date
        ? props.updatedAt
        : props.updatedAt
          ? new Date(props.updatedAt)
          : new Date();
  }
}
