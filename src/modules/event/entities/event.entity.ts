import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'common/enums/status.enum';
import { GenericDate, GenericString, Uuid } from 'common/value-objects';

export class Event {
  @ApiProperty({ example: 'uuid-v4-string', type: String })
  id!: Uuid;

  @ApiProperty({ example: 'Tech Conference 2025', type: String })
  name!: GenericString;

  @ApiProperty({ example: 'A conference about technology trends.', type: String })
  description!: GenericString;

  @ApiProperty({ example: '2025-08-15T14:00:00.000Z' })
  date!: GenericDate;

  @ApiProperty({ example: 'uuid-organizer-id', type: String })
  organizerId!: Uuid;

  @ApiProperty({ enum: Status, example: Status.ACTIVE })
  status!: Status;

  @ApiProperty({ example: '2025-06-02T18:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-06-02T18:05:00.000Z' })
  updatedAt!: Date;

  constructor(props: {
    id: string | Uuid;
    name: string | GenericString;
    description: string | GenericString;
    date: string | GenericDate;
    organizerId: string | Uuid;
    status: Status;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  }) {
    this.id = props.id instanceof Uuid ? props.id : new Uuid(props.id);
    this.name = props.name instanceof GenericString ? props.name : new GenericString(props.name);
    this.description =
      props.description instanceof GenericString
        ? props.description
        : new GenericString(props.description);
    this.date = props.date instanceof GenericDate ? props.date : new GenericDate(props.date);
    this.organizerId =
      props.organizerId instanceof Uuid ? props.organizerId : new Uuid(props.organizerId);
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
