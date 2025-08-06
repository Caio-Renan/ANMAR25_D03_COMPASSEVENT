import { ExceptionErrorMessages } from '@constants/error-messages/exception-error-messages';
import { LoggerService } from '@logger/logger.service';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

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

    function hasMessageProperty(obj: unknown): obj is { message: string | string[] } {
      return typeof obj === 'object' && obj !== null && 'message' in obj;
    }

    let message: string | string[];

    if (typeof responseMessage === 'string') {
      message = responseMessage;
    } else if (hasMessageProperty(responseMessage)) {
      message = responseMessage.message;
    } else {
      message = ExceptionErrorMessages.FILTER_EXCEPTION.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
