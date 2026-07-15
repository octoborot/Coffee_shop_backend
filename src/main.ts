import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cho phép CORS từ FE / Mini App
  app.enableCors();

  // Tự động validate tất cả DTO bằng class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Bỏ các field không khai báo trong DTO
      forbidNonWhitelisted: true, // Trả lỗi nếu FE gửi field lạ
      transform: true, // Tự động chuyển đổi kiểu dữ liệu
    }),
  );

  // Thêm Exception Filter tạm thời để debug lỗi 500
  @Catch()
  class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      console.error('Unhandled Exception:', exception);

      response.status(status).json({
        statusCode: status,
        message: exception.message || 'Internal server error',
        stack: exception.stack,
        details: exception,
      });
    }
  }
  app.useGlobalFilters(new AllExceptionsFilter());

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
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server đang chạy tại: http://0.0.0.0:${port}`);
  console.log(`📄 Swagger UI: http://localhost:${port}/api/docs`);
}
bootstrap();
