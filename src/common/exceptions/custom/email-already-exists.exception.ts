import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionErrorMessages } from '../../constants/error-messages/exception-error-messages';
export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super(ExceptionErrorMessages.CUSTOM_EXCEPTION.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}
