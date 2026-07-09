"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    let AllExceptionsFilter = class AllExceptionsFilter {
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const status = exception instanceof common_1.HttpException
                ? exception.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            console.error('Unhandled Exception:', exception);
            response.status(status).json({
                statusCode: status,
                message: exception.message || 'Internal server error',
                stack: exception.stack,
                details: exception,
            });
        }
    };
    AllExceptionsFilter = __decorate([
        (0, common_1.Catch)()
    ], AllExceptionsFilter);
    app.useGlobalFilters(new AllExceptionsFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Coffee Shop API')
        .setDescription('API docs cho Coffee Shop Mini App & Admin Dashboard')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
    console.log(`📄 Swagger UI: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map