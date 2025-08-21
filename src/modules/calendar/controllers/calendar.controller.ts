import { ParseUuidToValueObjectPipe } from '@common/pipes/parse-uuid-to-vo.pipe';
import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Uuid } from '@vo/index';
import { Response } from 'express';

import { CalendarTokenGuard } from '../guards/calendar-token.guard';
import { CalendarService } from '../services/calendar.service';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get(':eventId.ics')
  @UseGuards(CalendarTokenGuard)
  @ApiOperation({ summary: 'Download event calendar (.ics) with token authentication' })
  @ApiParam({ name: 'eventId', description: 'UUID of the event', type: String })
  @ApiQuery({ name: 'token', description: 'JWT token for authorization', required: true })
  @ApiResponse({ status: 200, description: 'ICS file returned', content: { 'text/calendar': {} } })
  @ApiResponse({ status: 404, description: 'Event not found or token invalid' })
  async downloadCalendar(
    @Param('eventId', ParseUuidToValueObjectPipe) eventId: Uuid,
    @Res() res: Response,
  ) {
    const calendarData = await this.calendarService.generateIcsByEventId(eventId);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=event-${eventId.value}.ics`);
    res.send(calendarData);
  }
}
