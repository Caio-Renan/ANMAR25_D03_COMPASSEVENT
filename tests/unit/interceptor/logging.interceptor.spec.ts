import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import { LoggingInterceptor } from '../../../src/common/interceptors/logging.interceptor';
import { LoggerService } from '../../../src/common/logger/logger.service';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let logger: LoggerService;
  let mockExecutionContext: ExecutionContext;

  const loggerMock = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    logger = loggerMock as unknown as LoggerService;
    interceptor = new LoggingInterceptor(logger);

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          originalUrl: '/test-url',
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
        getNext: () => undefined,
      }),
    } as unknown as ExecutionContext;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log successful response', done => {
    const callHandler: CallHandler = {
      handle: () => of('response'),
    };

    interceptor.intercept(mockExecutionContext, callHandler).subscribe({
      next: () => {
        expect(logger.log).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: '/test-url',
            statusCode: 200,
            delay: expect.any(Number),
          }),
          expect.stringMatching(/GET \/test-url 200 \+\d+ms/),
        );
        done();
      },
    });
  });

  it('should log error with Error instance', done => {
    const error = new Error('Test error');

    const callHandler: CallHandler = {
      handle: () => throwError(() => error),
    };

    interceptor.intercept(mockExecutionContext, callHandler).subscribe({
      error: () => {
        expect(logger.error).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: '/test-url',
            statusCode: 200,
            delay: expect.any(Number),
            errorMessage: 'Test error',
            stack: error.stack,
          }),
          expect.stringMatching(/GET \/test-url 200 \+\d+ms/),
        );
        done();
      },
    });
  });

  it('should log error when error is a string', done => {
    const error = 'String error';

    const callHandler: CallHandler = {
      handle: () => throwError(() => error),
    };

    interceptor.intercept(mockExecutionContext, callHandler).subscribe({
      error: () => {
        expect(logger.error).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: '/test-url',
            statusCode: 200,
            delay: expect.any(Number),
            errorMessage: 'String error',
            stack: undefined,
          }),
          expect.stringMatching(/GET \/test-url 200 \+\d+ms/),
        );
        done();
      },
    });
  });

  it('should log error when error is an object without message', done => {
    const error = { foo: 'bar' };

    const callHandler: CallHandler = {
      handle: () => throwError(() => error),
    };

    interceptor.intercept(mockExecutionContext, callHandler).subscribe({
      error: () => {
        expect(logger.error).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: '/test-url',
            statusCode: 200,
            delay: expect.any(Number),
            errorMessage: JSON.stringify(error),
            stack: undefined,
          }),
          expect.stringMatching(/GET \/test-url 200 \+\d+ms/),
        );
        done();
      },
    });
  });
  it('should fallback to 500 when response has no statusCode', done => {
    const error = new Error('No status code error');

    const contextWithoutStatusCode = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'POST',
          originalUrl: '/no-status',
        }),
        getResponse: () => ({}),
        getNext: () => undefined,
      }),
    } as unknown as ExecutionContext;

    const callHandler: CallHandler = {
      handle: () => throwError(() => error),
    };

    interceptor.intercept(contextWithoutStatusCode, callHandler).subscribe({
      error: () => {
        expect(logger.error).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: '/no-status',
            statusCode: 500,
            delay: expect.any(Number),
            errorMessage: 'No status code error',
            stack: error.stack,
          }),
          expect.stringMatching(/POST \/no-status 500 \+\d+ms/),
        );
        done();
      },
    });
  });
});
