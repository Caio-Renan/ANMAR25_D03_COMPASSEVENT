import { Event } from '@event/entities/event.entity';
import { EventService } from '@event/services/event.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Uuid } from '@vo/index';
import ical, { ICalEventData } from 'ical-generator';

@Injectable()
export class CalendarService {
  constructor(private readonly eventService: EventService) {}

  private buildIcsFromEvent(event: {
    id: string;
    title: string;
    description?: string;
    location?: string;
    start: Date;
    end: Date;
    timezone: string;
  }): string {
    const calendar = ical({ name: 'CompassEvent', timezone: event.timezone });

    const eventData: ICalEventData = {
      id: event.id,
      start: event.start,
      end: event.end,
      summary: event.title,
      description: event.description,
      location: event.location,
    };

    calendar.createEvent(eventData);

    return calendar.toString();
  }

  private mapEventToIcs(event: Event) {
    return {
      id: event.id.value,
      title: event.name.value,
      description: event.description?.value,
      start: new Date(event.date.value),
      end: new Date(new Date(event.date.value).getTime() + 60 * 60 * 1000),
      timezone: 'America/Sao_Paulo',
    };
  }

  async generateIcsByEventId(eventId: Uuid): Promise<string> {
    const event = await this.eventService.findById(eventId);

    if (!event) {
      throw new NotFoundException(`Event with id ${eventId.value} not found`);
    }

    const icsEvent = this.mapEventToIcs(event);
    return this.buildIcsFromEvent(icsEvent);
  }
}
