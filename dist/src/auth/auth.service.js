"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const bcrypt = __importStar(require("bcrypt"));
const auth_repository_1 = require("./auth.repository");
let AuthService = class AuthService {
    authRepository;
    jwtService;
    configService;
    constructor(authRepository, jwtService, configService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async zaloLogin(code) {
        const appId = this.configService.get('ZALO_APP_ID');
        const secretKey = this.configService.get('ZALO_APP_SECRET');
        let accessToken;
        try {
            const tokenRes = await axios_1.default.get('https://oauth.zaloapp.com/v4/oa/access_token', {
                params: { app_id: appId, code, grant_type: 'authorization_code' },
                headers: { secret_key: secretKey },
            });
            accessToken = tokenRes.data?.access_token;
            if (!accessToken)
                throw new Error('No access_token');
        }
        catch {
            throw new common_1.BadRequestException('Không thể xác thực với Zalo. Code không hợp lệ hoặc đã hết hạn.');
        }
        let zaloUser;
        try {
            const userRes = await axios_1.default.get('https://graph.zalo.me/v2.0/me', {
                params: { fields: 'id,name,picture' },
                headers: { access_token: accessToken },
            });
            zaloUser = userRes.data;
        }
        catch {
            throw new common_1.BadRequestException('Không thể lấy thông tin người dùng từ Zalo.');
        }
        let customer = await this.authRepository.findCustomerByZaloId(zaloUser.id);
        if (!customer) {
            customer = await this.authRepository.createCustomer({
                zalo_id: zaloUser.id,
                name: zaloUser.name,
                avatar_text: zaloUser.name.charAt(0).toUpperCase(),
            });
        }
        const token = this.jwtService.sign({
            sub: customer.id,
            role: 'customer',
        });
        return { access_token: token, customer };
    }
    async zaloMiniAppLogin(accessToken) {
        if (accessToken === 'test') {
            let customer = await this.authRepository.findCustomerByZaloId('mock_zalo_test');
            if (!customer) {
                customer = await this.authRepository.createCustomer({
                    zalo_id: 'mock_zalo_test',
                    name: 'Tài khoản Test (Zalo)',
                    avatar_text: 'T',
                });
            }
            const jwtToken = this.jwtService.sign({
                sub: customer.id,
                role: 'customer',
            });
            return { access_token: jwtToken, customer };
        }
        let zaloUser;
        try {
            const userRes = await axios_1.default.get('https://graph.zalo.me/v2.0/me', {
                params: { fields: 'id,name,picture' },
                headers: { access_token: accessToken },
            });
            zaloUser = userRes.data;
        }
        catch {
            throw new common_1.BadRequestException('Không thể lấy thông tin người dùng từ Zalo. Access Token không hợp lệ.');
        }
        if (zaloUser.error) {
            throw new common_1.BadRequestException(`Lỗi từ Zalo: ${zaloUser.message || 'Unknown error'}`);
        }
        let customer = await this.authRepository.findCustomerByZaloId(zaloUser.id);
        if (!customer) {
            customer = await this.authRepository.createCustomer({
                zalo_id: zaloUser.id,
                name: zaloUser.name,
                avatar_text: zaloUser.name.charAt(0).toUpperCase(),
            });
        }
        const jwtToken = this.jwtService.sign({
            sub: customer.id,
            role: 'customer',
        });
        return { access_token: jwtToken, customer };
    }
    async zaloMiniAppGetPhone(customerId, accessToken, token) {
        const secretKey = this.configService.get('ZALO_APP_SECRET');
        if (!secretKey) {
            throw new common_1.BadRequestException('Chưa cấu hình ZALO_APP_SECRET');
        }
        try {
            const response = await axios_1.default.get('https://graph.zalo.me/v2.0/me/info', {
                headers: {
                    access_token: accessToken,
                    code: token,
                    secret_key: secretKey,
                },
            });
            const data = response.data;
            if (data.error) {
                throw new common_1.BadRequestException(`Lỗi giải mã số điện thoại: ${data.message}`);
            }
            const phone = data.data?.number;
            if (!phone) {
                throw new common_1.BadRequestException('Không tìm thấy số điện thoại trong payload.');
            }
            await this.authRepository.updateCustomerPhone(customerId, phone);
            return { phone, message: 'Cập nhật số điện thoại thành công' };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.BadRequestException('Không thể gọi API Zalo để lấy số điện thoại.');
        }
    }
    async adminLogin(username, password) {
        const admin = await this.authRepository.findAdminByUsername(username);
        if (!admin) {
            throw new common_1.UnauthorizedException('Tài khoản hoặc mật khẩu không đúng.');
        }
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Tài khoản hoặc mật khẩu không đúng.');
        }
        const token = this.jwtService.sign({
            sub: admin.id,
            role: admin.role.toLowerCase(),
            username: admin.username,
        });
        return {
            access_token: token,
            admin: { id: admin.id, username: admin.username, role: admin.role },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map