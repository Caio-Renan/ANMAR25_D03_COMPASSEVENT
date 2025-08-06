import { Roles } from '@enums/roles.enum';
import { Status } from '@enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Email, Name, Password, PhoneNumber, Uuid } from '@vo/index';

export class User {
  @ApiProperty({ example: 'uuid-v4-string', type: String })
  id!: Uuid;

  @ApiProperty({ example: 'James Michael', type: String })
  name!: Name;

  @ApiProperty({ example: 'test@example.com', type: String })
  email!: Email;

  @ApiProperty({ example: 'hashed-password', type: String })
  password!: Password;

  @ApiProperty({ example: '+5511999999999', type: String })
  phone!: PhoneNumber;

  @ApiProperty({ enum: [Roles.ORGANIZER, Roles.PARTICIPANT], example: Roles.PARTICIPANT })
  role!: Roles;

  @ApiProperty({ enum: Status, example: Status.ACTIVE })
  status!: Status;

  @ApiProperty({ example: '2025-06-02T18:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2025-06-02T18:05:00.000Z' })
  updatedAt!: Date;

  constructor(props: {
    id: string | Uuid;
    name: string | Name;
    email: string | Email;
    password: string | Password;
    phone: string | PhoneNumber;
    role: Roles;
    status: Status;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  }) {
    this.id = props.id instanceof Uuid ? props.id : new Uuid(props.id);
    this.name = props.name instanceof Name ? props.name : new Name(props.name);
    this.email = props.email instanceof Email ? props.email : new Email(props.email);
    this.password =
      props.password instanceof Password ? props.password : new Password(props.password);
    this.phone = props.phone instanceof PhoneNumber ? props.phone : new PhoneNumber(props.phone);
    this.role = props.role;
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
