import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionErrorMessages } from '../../../../src/common/constants/error-messages/exception-error-messages';
import { AccessDeniedException } from '../../../../src/common/exceptions';

describe('AccessDeniedException', () => {
  it('should create an HttpException with status 403 and proper message', () => {
    const exception = new AccessDeniedException();

    expect(exception).toBeInstanceOf(HttpException);
    expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
    expect(exception.message).toBe(ExceptionErrorMessages.CUSTOM_EXCEPTION.ACCESS_DENIED);
    expect(exception.getResponse()).toBe(ExceptionErrorMessages.CUSTOM_EXCEPTION.ACCESS_DENIED);
  });
});
