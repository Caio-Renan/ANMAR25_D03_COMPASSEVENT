import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionErrorMessages } from 'common/constants/error-messages/exception-error-messages';

import { EventNotFoundException } from '../../../../src/common/exceptions';

describe('EventNotFoundException', () => {
  it('should create an HttpException with status 404 and proper message', () => {
    const exception = new EventNotFoundException();

    expect(exception).toBeInstanceOf(HttpException);
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    expect(exception.message).toBe(ExceptionErrorMessages.CUSTOM_EXCEPTION.EVENT_NOT_FOUND);
    expect(exception.getResponse()).toBe(ExceptionErrorMessages.CUSTOM_EXCEPTION.EVENT_NOT_FOUND);
  });
});
