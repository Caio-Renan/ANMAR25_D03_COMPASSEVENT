import { CreateEventDto } from '@event/dtos/create-event.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
