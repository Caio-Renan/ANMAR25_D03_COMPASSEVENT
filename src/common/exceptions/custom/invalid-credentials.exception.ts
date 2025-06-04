import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionErrorMessages } from '../../constants/error-messages/exception-error-messages';
export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      ExceptionErrorMessages.CUSTOM_EXCEPTION.INVALID_EMAIL_OR_PASSWORD,
      HttpStatus.UNAUTHORIZED,
    );
  }
}
