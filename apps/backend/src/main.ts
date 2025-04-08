import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app  = await NestFactory.create(AppModule);
  const conf = app.get(ConfigService);
  const port = conf.get<number>('PORT') || 3000;

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.enableCors();

  const swagger = new DocumentBuilder()
    .setTitle('Sachsen')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, swagger);

  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
