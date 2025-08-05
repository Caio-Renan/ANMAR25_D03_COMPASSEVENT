import { ExceptionErrorMessages } from '@constants/error-messages/exception-error-messages';
import { HttpException, HttpStatus } from '@nestjs/common';

export class AccessDeniedException extends HttpException {
  constructor() {
    super(ExceptionErrorMessages.CUSTOM_EXCEPTION.ACCESS_DENIED, HttpStatus.FORBIDDEN);
  }
}
