import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionErrorMessages } from 'common/constants/error-messages/exception-error-messages';

import { EmailAlreadyExistsException } from '../../../../src/common/exceptions';

describe('EmailAlreadyExistsException', () => {
  it('should create an HttpException with status 409 and proper message', () => {
    const exception = new EmailAlreadyExistsException();

    expect(exception).toBeInstanceOf(HttpException);
    expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(exception.message).toBe(ExceptionErrorMessages.CUSTOM_EXCEPTION.EMAIL_ALREADY_EXISTS);
    expect(exception.getResponse()).toBe(
      ExceptionErrorMessages.CUSTOM_EXCEPTION.EMAIL_ALREADY_EXISTS,
    );
  });
});
