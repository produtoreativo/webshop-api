import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import {
  APM_MIDDLEWARE,
  ApmErrorInterceptor,
  ApmHttpUserContextInterceptor,
  initializeAPMAgent,
} from 'elastic-apm-nest';

initializeAPMAgent({
  serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
  serverUrl: process.env.ELASTIC_APM_SERVER_URL,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('WebShop API')
    .setDescription('WebShop API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const apmMiddleware = app.get(APM_MIDDLEWARE);
  const globalInterceptors = [
    app.get(ApmHttpUserContextInterceptor),
    app.get(ApmErrorInterceptor),
  ];
  app.useGlobalInterceptors(...globalInterceptors);
  app.use(apmMiddleware);

  await app.listen(3000);

  const signals = {
    SIGHUP: 1,
    SIGINT: 2,
    SIGTERM: 15,
  };
  const shutdown = async (signal, value) => {
    console.log('shutdown!');
    await app.close();
    console.log(`server stopped by ${signal} with value ${value}`);
    process.exit(128 + value);
  };
  Object.keys(signals).forEach((signal) => {
    process.on(signal, () => {
      console.log(`process received a ${signal} signal`);
      shutdown(signal, signals[signal]);
    });
  });
}
bootstrap();
