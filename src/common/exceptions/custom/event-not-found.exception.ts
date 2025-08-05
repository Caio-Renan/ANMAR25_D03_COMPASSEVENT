import { ExceptionErrorMessages } from '@constants/error-messages/exception-error-messages';
import { HttpException, HttpStatus } from '@nestjs/common';
export class EventNotFoundException extends HttpException {
  constructor() {
    super(ExceptionErrorMessages.CUSTOM_EXCEPTION.EVENT_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
