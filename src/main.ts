import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { AllExceptionsFilter } from './utils/exceptions.filter';
import { RateLimitMiddleware } from './utils/rate-limit.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
    : ['http://localhost:5173'];

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extras
      transform: true, // Transforma los tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true, // Convierte tipos implícitamente
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('hackaton fin 4 all')
    .setDescription('hackaton fin 4 all')
    .setVersion('1.0')
    .addTag('hackaton fin 4 all')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(new RateLimitMiddleware().use);

  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  await app.listen(process.env.PORT ?? 3000);

  console.log(`API corriendo en http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
