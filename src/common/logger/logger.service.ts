import type { LoggerService as NestLoggerService } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Logger as PinoLogger } from 'pino';
import pino from 'pino';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: PinoLogger;

  constructor() {
    const isDev = process.env.NODE_ENV !== 'production';

    this.logger = pino({
      level: isDev ? 'debug' : 'info',
      base: isDev ? undefined : { pid: undefined, hostname: undefined },
      transport: isDev
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    });
  }

  log(context: object, message: string, ...args: unknown[]) {
    this.logger.info(context, message, ...args);
  }

  error(context: object, message: string, ...args: unknown[]) {
    this.logger.error(context, message, ...args);
  }

  warn(context: object, message: string, ...args: unknown[]) {
    this.logger.warn(context, message, ...args);
  }

  debug(context: object, message: string, ...args: unknown[]) {
    this.logger.debug(context, message, ...args);
  }

  verbose(context: object, message: string, ...args: unknown[]) {
    this.logger.trace(context, message, ...args);
  }
}
