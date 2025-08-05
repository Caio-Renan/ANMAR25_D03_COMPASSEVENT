import { LoggerService } from '@logger/logger.service';
import pino from 'pino';

jest.mock('pino');

describe('LoggerService', () => {
  let loggerService: LoggerService;
  const pinoMock = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  };

  beforeEach(() => {
    (pino as unknown as jest.Mock).mockReturnValue(pinoMock);
    loggerService = new LoggerService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create pino logger with correct config for non-production', () => {
    process.env.NODE_ENV = 'development';
    const instance = new LoggerService();
    expect(pino).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'debug',
        transport: expect.any(Object),
      }),
    );
    expect(instance).toBeDefined();
  });

  it('should create pino logger with correct config for production', () => {
    process.env.NODE_ENV = 'production';
    const instance = new LoggerService();
    expect(pino).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info',
        base: { pid: undefined, hostname: undefined },
        transport: undefined,
      }),
    );
    expect(instance).toBeDefined();
  });

  it('log() should call logger.info with proper args', () => {
    const context = { ctx: 'context' };
    const message = 'test message';
    const args = ['arg1', 'arg2'];
    loggerService.log(context, message, ...args);
    expect(pinoMock.info).toHaveBeenCalledWith(context, message, ...args);
  });

  it('error() should call logger.error with proper args', () => {
    const context = { ctx: 'context' };
    const message = 'error message';
    const args = ['arg1', 'arg2'];
    loggerService.error(context, message, ...args);
    expect(pinoMock.error).toHaveBeenCalledWith(context, message, ...args);
  });

  it('warn() should call logger.warn with proper args', () => {
    const context = { ctx: 'context' };
    const message = 'warn message';
    const args = ['arg1'];
    loggerService.warn(context, message, ...args);
    expect(pinoMock.warn).toHaveBeenCalledWith(context, message, ...args);
  });

  it('debug() should call logger.debug with proper args', () => {
    const context = { ctx: 'context' };
    const message = 'debug message';
    loggerService.debug(context, message);
    expect(pinoMock.debug).toHaveBeenCalledWith(context, message);
  });

  it('verbose() should call logger.trace with proper args', () => {
    const context = { ctx: 'context' };
    const message = 'verbose message';
    loggerService.verbose(context, message);
    expect(pinoMock.trace).toHaveBeenCalledWith(context, message);
  });
});
