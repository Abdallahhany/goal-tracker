import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // only allow properties that are defined in the DTO
    transform: true, // automatically transform payloads to DTO instances
    forbidNonWhitelisted: true, // reject requests with non-whitelisted properties
  }));

  // Enable CORS for frontend application
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  
}
bootstrap();
