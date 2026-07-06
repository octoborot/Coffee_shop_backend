import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cho phép CORS từ FE / Mini App
  app.enableCors();

  // Tự động validate tất cả DTO bằng class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,      // Bỏ các field không khai báo trong DTO
      forbidNonWhitelisted: true, // Trả lỗi nếu FE gửi field lạ
      transform: true,      // Tự động chuyển đổi kiểu dữ liệu
    }),
  );

  // Swagger UI
  const config = new DocumentBuilder()
    .setTitle('Coffee Shop API')
    .setDescription('API docs cho Coffee Shop Mini App & Admin Dashboard')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
  console.log(`📄 Swagger UI: http://localhost:${port}/api/docs`);
}
bootstrap();
