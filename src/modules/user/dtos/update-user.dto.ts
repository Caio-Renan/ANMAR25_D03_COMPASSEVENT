import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '@user/dtos/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
