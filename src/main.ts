import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const docBuilder = new DocumentBuilder()
    .setTitle('RESTful API.')
    .setDescription('RESTful API to save and manage your resources.')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const docs = SwaggerModule.createDocument(app, docBuilder);
  SwaggerModule.setup('docs', app, docs);
  await app.listen(5050);
}
bootstrap();
