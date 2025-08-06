import { ExceptionErrorMessages } from '@constants/error-messages/exception-error-messages';
import { HttpException, HttpStatus } from '@nestjs/common';
export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super(ExceptionErrorMessages.CUSTOM_EXCEPTION.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}
