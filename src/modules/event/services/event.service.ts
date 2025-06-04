import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Roles } from 'src/common/enums/roles.enum';
import { Status } from 'src/common/enums/status.enum';
import { GenericDate, GenericString, Uuid } from 'src/common/value-objects';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';

import { CreateEventDto } from '../dtos/create-event.dto';
import { QueryEventsDto } from '../dtos/query-events.dto';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { Event } from '../entities/event.entity';
import { EventRepository } from '../repositories/event.repository';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const now = new Date();
    const eventDate = new Date(createEventDto.date);

    this.validateEventDate(eventDate);

    const existingEvent = await this.findByName(new GenericString(createEventDto.name));
    if (existingEvent) {
      throw new BadRequestException('Event name already exists');
    }

    await this.getValidOrganizerById(new Uuid(createEventDto.organizerId));

    const event = new Event({
      id: new Uuid(uuidv4()),
      name: new GenericString(createEventDto.name),
      description: new GenericString(createEventDto.description),
      date: new GenericDate(createEventDto.date),
      organizerId: new Uuid(createEventDto.organizerId),
      status: Status.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });

    await this.eventRepository.create(event);
    return event;
  }

  async findById(id: Uuid): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async findByName(name: GenericString): Promise<Event | null> {
    return this.eventRepository.findByName(name);
  }

  async update(id: Uuid, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findById(id);
    const now = new Date();
    const eventDate = updateEventDto.date ? new Date(updateEventDto.date) : event.date.value;

    if (updateEventDto.date) {
      this.validateEventDate(eventDate);
    }
    if (updateEventDto.name && updateEventDto.name !== event.name.value) {
      const existingEvent = await this.findByName(new GenericString(updateEventDto.name));
      if (existingEvent && existingEvent.id.value !== id.value) {
        throw new BadRequestException('Event name already exists');
      }
    }

    let newOrganizerId = event.organizerId;
    if (updateEventDto.organizerId) {
      await this.getValidOrganizerById(new Uuid(updateEventDto.organizerId));
      newOrganizerId = new Uuid(updateEventDto.organizerId);
    }

    const updatedEvent = new Event({
      id: event.id,
      name: updateEventDto.name ? new GenericString(updateEventDto.name) : event.name,
      description: updateEventDto.description
        ? new GenericString(updateEventDto.description)
        : event.description,
      date: updateEventDto.date ? new GenericDate(updateEventDto.date) : event.date,
      organizerId: newOrganizerId,
      status: event.status,
      createdAt: event.createdAt,
      updatedAt: now,
    });

    await this.eventRepository.update(updatedEvent);
    return updatedEvent;
  }

  async softDelete(id: Uuid): Promise<void> {
    const event = await this.findById(id);

    if (event.status === Status.INACTIVE) {
      throw new BadRequestException('Event is already inactive');
    }

    const deletedEvent = new Event({
      ...event,
      status: Status.INACTIVE,
      updatedAt: new Date(),
    });

    await this.eventRepository.update(deletedEvent);
  }

  async findAll(query: QueryEventsDto): Promise<{ items: Event[]; lastEvaluatedKey?: string }> {
    return this.eventRepository.findAll(query);
  }

  async getValidOrganizerById(id: Uuid): Promise<void> {
    const organizer = await this.userRepository.findById(id);

    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }

    if (organizer.status !== Status.ACTIVE) {
      throw new BadRequestException('Organizer must be active');
    }

    if (organizer.role !== Roles.ORGANIZER) {
      throw new BadRequestException(`User role must be ${Roles.ORGANIZER} to perform this action`);
    }
  }

  private validateEventDate(eventDate: Date): void {
    const now = new Date();
    const minimumDate = new Date(now.getTime() + 15 * 60 * 1000);

    if (eventDate < minimumDate) {
      throw new BadRequestException('The event date must be at least 15 minutes from now');
    }
  }
}
