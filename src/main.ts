import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Boukine API')
    .setDescription('The Boukine API description')
    .setVersion('1.0')
    .addTag('boukine')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);
  const url = 'http://localhost:' + (process.env.PORT ?? 3001);
  console.log(`Application is running on: ${url}`);
  console.log(`Swagger is available on: ${url}/api`);
}
void bootstrap();
