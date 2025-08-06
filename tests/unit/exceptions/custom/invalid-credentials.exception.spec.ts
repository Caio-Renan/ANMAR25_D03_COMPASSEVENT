import { ExceptionErrorMessages } from '@constants/error-messages/exception-error-messages';
import { InvalidCredentialsException } from '@exceptions/index';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('InvalidCredentialsException', () => {
  it('should create an HttpException with status 401 and proper message', () => {
    const exception = new InvalidCredentialsException();

    expect(exception).toBeInstanceOf(HttpException);
    expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    expect(exception.message).toBe(
      ExceptionErrorMessages.CUSTOM_EXCEPTION.INVALID_EMAIL_OR_PASSWORD,
    );
    expect(exception.getResponse()).toBe(
      ExceptionErrorMessages.CUSTOM_EXCEPTION.INVALID_EMAIL_OR_PASSWORD,
    );
  });
});
