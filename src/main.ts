import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const logger = new LoggerService();

  try {
    const app = await NestFactory.create(AppModule);

    app.useLogger(app.get(LoggerService));

    app.enableCors();
    app.setGlobalPrefix('api/v1');
    app.use(helmet());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Compass Event API')
      .setDescription('API for managing users, events, and registrations')
      .setVersion('0.0.1')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(
        { errorMessage: error.message, stack: error.stack },
        'Error starting the application',
      );
    } else {
      logger.error(
        { errorMessage: 'Unknown error', rawError: error },
        'Error starting the application',
      );
    }
    process.exit(1);
  }
}
void bootstrap();
