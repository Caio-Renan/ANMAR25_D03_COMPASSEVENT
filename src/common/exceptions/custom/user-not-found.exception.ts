import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionErrorMessages } from '../../constants/error-messages/exception-error-messages';
export class UserNotFoundException extends HttpException {
  constructor() {
    super(ExceptionErrorMessages.CUSTOM_EXCEPTION.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
