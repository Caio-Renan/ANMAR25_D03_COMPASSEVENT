import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionErrorMessages } from '../../constants/error-messages/exception-error-messages';

export class AccessDeniedException extends HttpException {
  constructor() {
    super(ExceptionErrorMessages.CUSTOM_EXCEPTION.ACCESS_DENIED, HttpStatus.FORBIDDEN);
  }
}
