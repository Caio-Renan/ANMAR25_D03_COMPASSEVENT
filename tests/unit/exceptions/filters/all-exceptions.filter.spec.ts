import { ExceptionErrorMessages } from '@constants/error-messages/exception-error-messages';
import { AllExceptionsFilter } from '@exceptions/index';
import { LoggerService } from '@logger/logger.service';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let loggerService: LoggerService;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;
  const path = '/test-url';

  beforeEach(() => {
    loggerService = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as unknown as LoggerService;

    filter = new AllExceptionsFilter(loggerService);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: path,
    };

    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should log error and handle HttpException with string message', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    filter.catch(exception, mockHost);

    expect(loggerService.error).toHaveBeenCalledWith(
      { exception },
      'Unhandled exception caught in AllExceptionsFilter',
    );
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Forbidden',
        path,
        timestamp: expect.any(String),
      }),
    );
  });

  it('should log error and handle HttpException with object message', () => {
    const exceptionResponse = { message: 'Validation failed', errors: ['field1 is required'] };
    const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockHost);

    expect(loggerService.error).toHaveBeenCalledWith(
      { exception },
      'Unhandled exception caught in AllExceptionsFilter',
    );
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        path,
        timestamp: expect.any(String),
      }),
    );
  });

  it('should log error and handle unexpected non-HttpException error', () => {
    const exception = new Error('Unexpected error');

    filter.catch(exception, mockHost);

    expect(loggerService.error).toHaveBeenCalledWith(
      { exception },
      'Unhandled exception caught in AllExceptionsFilter',
    );
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ExceptionErrorMessages.FILTER_EXCEPTION.INTERNAL_SERVER_ERROR,
        path,
        timestamp: expect.any(String),
      }),
    );
  });
});
