import { Roles } from '@enums/roles.enum';
import { Status } from '@enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@user/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-v4-string' })
  id!: string;

  @ApiProperty({ example: 'James Michael' })
  name!: string;

  @ApiProperty({ example: 'test@example.com' })
  email!: string;

  @ApiProperty({ example: '+5511999999999' })
  phone!: string;

  @ApiProperty({ enum: [Roles.ORGANIZER, Roles.PARTICIPANT], example: Roles.PARTICIPANT })
  role!: Roles;

  @ApiProperty({ enum: Status, example: Status.ACTIVE })
  status!: Status;

  @ApiProperty({ example: '2025-06-02T18:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2025-06-02T18:05:00.000Z' })
  updatedAt!: string;

  constructor(user: User) {
    this.id = user.id.value;
    this.name = user.name.value;
    this.email = user.email.value;
    this.phone = user.phone.value;
    this.role = user.role;
    this.status = user.status;
    this.createdAt = user.createdAt?.toISOString();
    this.updatedAt = user.updatedAt?.toISOString();
  }
}
