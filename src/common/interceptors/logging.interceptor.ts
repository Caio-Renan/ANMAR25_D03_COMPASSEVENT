import type { LoggerService } from '@logger/logger.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const delay = Date.now() - now;

          this.logger.log(
            { method, url: originalUrl, statusCode, delay },
            `${method} ${originalUrl} ${statusCode} +${delay}ms`,
          );
        },
        error: err => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response?.statusCode ?? 500;
          const delay = Date.now() - now;

          const errorMessage =
            err instanceof Error
              ? err.message
              : typeof err === 'string'
                ? err
                : JSON.stringify(err);

          const stack = err instanceof Error ? err.stack : undefined;

          this.logger.error(
            {
              method,
              url: originalUrl,
              statusCode,
              delay,
              errorMessage,
              stack,
            },
            `${method} ${originalUrl} ${statusCode} +${delay}ms`,
          );
        },
      }),
    );
  }
}
