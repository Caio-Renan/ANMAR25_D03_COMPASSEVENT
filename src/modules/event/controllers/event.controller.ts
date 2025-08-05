import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { CurrentUser } from '@decorators/current-user.decorator';
import { RolesDecorator } from '@decorators/roles.decorator';
import { Roles } from '@enums/roles.enum';
import { CreateEventDto } from '@event/dtos/create-event.dto';
import { EventResponseDto } from '@event/dtos/event-response.dto';
import { QueryEventsDto } from '@event/dtos/query-events.dto';
import { UpdateEventDto } from '@event/dtos/update-event.dto';
import { EventService } from '@event/services/event.service';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationTokenPipe } from '@pipes/pagination-token.pipe';
import { ParseUuidToValueObjectPipe } from '@pipes/parse-uuid-to-vo.pipe';
import { Uuid } from '@vo/index';

@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @RolesDecorator(Roles.ADMIN, Roles.ORGANIZER)
  @ApiOperation({ summary: 'Create a new event (admin or organizer)' })
  @ApiResponse({ status: 201, description: 'Event created', type: EventResponseDto })
  async create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<EventResponseDto> {
    if (createEventDto.organizerId !== currentUser.sub) {
      throw new ForbiddenException('You should use your own Uuid');
    }

    const event = await this.eventService.create({
      ...createEventDto,
      organizerId: currentUser.sub,
    });
    return new EventResponseDto(event);
  }

  @Get(':id')
  @RolesDecorator(Roles.ADMIN, Roles.ORGANIZER, Roles.PARTICIPANT)
  @ApiOperation({ summary: 'Get event by id (all authenticated roles)' })
  @ApiParam({ name: 'id', description: 'Event UUID', type: String })
  @ApiResponse({ status: 200, description: 'Event found', type: EventResponseDto })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id', ParseUuidToValueObjectPipe) id: Uuid): Promise<EventResponseDto> {
    const event = await this.eventService.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    return new EventResponseDto(event);
  }

  @Patch(':id')
  @RolesDecorator(Roles.ADMIN, Roles.ORGANIZER)
  @ApiOperation({ summary: 'Update event (admin or event organizer)' })
  @ApiParam({ name: 'id', description: 'Event UUID', type: String })
  @ApiResponse({ status: 200, description: 'Event updated', type: EventResponseDto })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(
    @Param('id', ParseUuidToValueObjectPipe) id: Uuid,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<EventResponseDto> {
    const event = await this.eventService.findById(id);
    if (!event) throw new NotFoundException('Event not found');

    if (currentUser.role !== Roles.ADMIN && event.organizerId.value !== currentUser.sub) {
      throw new ForbiddenException('You do not have permission to update this event');
    }

    const updatedEvent = await this.eventService.update(id, updateEventDto);
    return new EventResponseDto(updatedEvent);
  }

  @Delete(':id')
  @RolesDecorator(Roles.ADMIN, Roles.ORGANIZER)
  @HttpCode(204)
  @ApiOperation({ summary: 'Soft delete event (admin or event organizer)' })
  @ApiParam({ name: 'id', description: 'Event UUID', type: String })
  @ApiResponse({ status: 204, description: 'Event soft deleted' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async remove(
    @Param('id', ParseUuidToValueObjectPipe) id: Uuid,
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<void> {
    const event = await this.eventService.findById(id);
    if (!event) throw new NotFoundException('Event not found');

    if (currentUser.role !== Roles.ADMIN && event.organizerId.value !== currentUser.sub) {
      throw new ForbiddenException('You do not have permission to delete this event');
    }

    await this.eventService.softDelete(id);
  }

  @Get()
  @RolesDecorator(Roles.ADMIN, Roles.ORGANIZER, Roles.PARTICIPANT)
  @ApiOperation({ summary: 'List events with optional filters and pagination' })
  @ApiResponse({ status: 200, description: 'List of events', type: [EventResponseDto] })
  async findAll(
    @Query() query: QueryEventsDto,
    @Query('lastEvaluatedKey', PaginationTokenPipe) lastEvaluatedKey?: Record<string, unknown>,
  ): Promise<{ items: EventResponseDto[]; lastEvaluatedKey?: string }> {
    if (lastEvaluatedKey) {
      query.lastEvaluatedKey = lastEvaluatedKey;
    }

    const result = await this.eventService.findAll(query);

    return {
      items: result.items.map(event => new EventResponseDto(event)),
      lastEvaluatedKey: result.lastEvaluatedKey,
    };
  }
}
