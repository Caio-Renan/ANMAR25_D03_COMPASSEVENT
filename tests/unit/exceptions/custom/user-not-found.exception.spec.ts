import { ExceptionErrorMessages } from '@constants/error-messages/exception-error-messages';
import { UserNotFoundException } from '@exceptions/index';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserNotFoundException', () => {
  it('should create an HttpException with status 404 and proper message', () => {
    const exception = new UserNotFoundException();

    expect(exception).toBeInstanceOf(HttpException);
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    expect(exception.message).toBe(ExceptionErrorMessages.CUSTOM_EXCEPTION.USER_NOT_FOUND);
    expect(exception.getResponse()).toBe(ExceptionErrorMessages.CUSTOM_EXCEPTION.USER_NOT_FOUND);
  });
});
