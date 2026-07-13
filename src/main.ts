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
import { Response } from 'express';

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
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      console.error('Unhandled Exception:', exception);

      const exceptionResponse =
        exception instanceof HttpException ? exception.getResponse() : null;
      const message =
        status < Number(HttpStatus.INTERNAL_SERVER_ERROR)
          ? typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as { message?: string | string[] } | null)
                ?.message ||
              (exception instanceof Error
                ? exception.message
                : String(exception))
          : 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.';

      response.status(status).json({
        statusCode: status,
        message,
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
  await app.listen(port);
  console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
  console.log(`📄 Swagger UI: http://localhost:${port}/api/docs`);
}
bootstrap();
