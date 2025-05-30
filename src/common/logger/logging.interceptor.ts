import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs';
import type { LoggerService } from './logger.service';

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

          this.logger.error(
            {
              method,
              url: originalUrl,
              statusCode,
              delay,
              errorMessage: err?.message ?? err,
              stack: err?.stack,
            },
            `${method} ${originalUrl} ${statusCode} +${delay}ms`,
          );
        },
      }),
    );
  }
}
