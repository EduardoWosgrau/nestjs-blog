import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // Swagger configurations
  const config = new DocumentBuilder()
    .setTitle('NestJs Masterclass - Blog app API')
    .setVersion('1.0')
    .setDescription('Use the API URL at http://localhost:3030')
    .setTermsOfService('http://localhost:3030/terms-of-service')
    .setLicense('MIT License', 'https://en.wikipedia.org/wiki/MIT_License')
    .addServer('http://localhost:3030')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3030);
}
bootstrap();
