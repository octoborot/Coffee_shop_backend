"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const zalo_login_dto_1 = require("./dto/zalo-login.dto");
const zalo_miniapp_login_dto_1 = require("./dto/zalo-miniapp-login.dto");
const zalo_phone_dto_1 = require("./dto/zalo-phone.dto");
const admin_login_dto_1 = require("./dto/admin-login.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    zaloLogin(dto) {
        return this.authService.zaloLogin(dto.code);
    }
    zaloMiniAppLogin(dto) {
        return this.authService.zaloMiniAppLogin(dto.access_token);
    }
    zaloMiniAppGetPhone(dto) {
        return this.authService.zaloMiniAppGetPhone(dto.customerId, dto.access_token, dto.token);
    }
    adminLogin(dto) {
        return this.authService.adminLogin(dto.username, dto.password);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('zalo-login'),
    (0, swagger_1.ApiOperation)({ summary: 'Đăng nhập qua Zalo Mini App (Customer)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Trả về JWT token và thông tin Customer',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zalo_login_dto_1.ZaloLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "zaloLogin", null);
__decorate([
    (0, common_1.Post)('zalo-miniapp/login'),
    (0, swagger_1.ApiOperation)({ summary: 'Đăng nhập qua Zalo Mini App (Bằng Access Token)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Trả về JWT token và thông tin Customer',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zalo_miniapp_login_dto_1.ZaloMiniAppLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "zaloMiniAppLogin", null);
__decorate([
    (0, common_1.Post)('zalo-miniapp/phone'),
    (0, swagger_1.ApiOperation)({ summary: 'Giải mã số điện thoại từ Zalo Mini App' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Trả về số điện thoại và cập nhật vào Customer',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [zalo_phone_dto_1.ZaloPhoneDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "zaloMiniAppGetPhone", null);
__decorate([
    (0, common_1.Post)('admin/login'),
    (0, swagger_1.ApiOperation)({ summary: 'Đăng nhập Admin bằng username/password' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Trả về JWT token và thông tin Admin',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Sai tài khoản hoặc mật khẩu' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.AdminLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "adminLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('api/v1/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map