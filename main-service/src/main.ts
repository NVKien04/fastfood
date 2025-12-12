import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(helmet();

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://your-frontend.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
    ],
    exposedHeaders: ['Authorization', 'Content-Length', 'X-Kuma-Revision'],
    credentials: true, // Cho phép cookie / Auth header
    maxAge: 86400, // Cache preflight request 24h
    preflightContinue: false, // Không trả về response cho OPTIONS qua middleware
    optionsSuccessStatus: 204, // Mã trả về cho preflight
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //chuyển payload thành InstanceDto
      whitelist: true, //xóa các fields không có trong dto
      forbidNonWhitelisted: true, //báo lỗi dư thưa fields
      disableErrorMessages: false,
      transformOptions: { enableImplicitConversion: true }, //cho phép transform dữ liệu của fields
    }),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
