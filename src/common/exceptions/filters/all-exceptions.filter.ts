import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionErrorMessages } from '../../constants/error-messages/exception-error-messages';
import { LoggerService } from '../../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error({ exception }, 'Unhandled exception caught in AllExceptionsFilter');

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseMessage = exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof responseMessage === 'string'
        ? responseMessage
        : responseMessage && typeof responseMessage === 'object' && 'message' in responseMessage
          ? (responseMessage as any).message
          : ExceptionErrorMessages.FILTER_EXCEPTION.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
