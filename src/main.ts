import { AppModule } from '@app/app.module';
import { LoggerService } from '@logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';

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

    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

    const config = new DocumentBuilder()
      .setTitle('Compass Event API')
      .setDescription('API for managing users, events, and registrations')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          in: 'header',
        },
        'bearer',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const configService = app.get(ConfigService);

    const port = configService.get<number>('PORT', { infer: true });

    await app.listen(port);
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
