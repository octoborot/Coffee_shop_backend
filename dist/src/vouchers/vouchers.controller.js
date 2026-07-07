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
exports.VouchersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_voucher_dto_1 = require("./dto/create-voucher.dto");
const get_vouchers_query_dto_1 = require("./dto/get-vouchers-query.dto");
const update_voucher_dto_1 = require("./dto/update-voucher.dto");
const vouchers_service_1 = require("./vouchers.service");
let VouchersController = class VouchersController {
    vouchersService;
    constructor(vouchersService) {
        this.vouchersService = vouchersService;
    }
    findActive(query) {
        return this.vouchersService.findActive(query);
    }
    findByCode(code) {
        return this.vouchersService.findByCode(code);
    }
    findAll(query) {
        return this.vouchersService.findAll(query);
    }
    findOne(id) {
        return this.vouchersService.findOne(id);
    }
    create(dto, req) {
        return this.vouchersService.create(dto, req.user.id);
    }
    update(id, dto, req) {
        return this.vouchersService.update(id, dto, req.user.id);
    }
    remove(id) {
        return this.vouchersService.remove(id);
    }
};
exports.VouchersController = VouchersController;
__decorate([
    (0, common_1.Get)('vouchers'),
    (0, swagger_1.ApiOperation)({
        summary: 'Lấy danh sách voucher đang hoạt động cho Mini App',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_vouchers_query_dto_1.GetVouchersQueryDto]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('vouchers/code/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy voucher theo mã' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)('admin/vouchers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả voucher (Admin)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_vouchers_query_dto_1.GetVouchersQueryDto]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('admin/vouchers/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy chi tiết voucher (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('admin/vouchers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo voucher (Admin)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_voucher_dto_1.CreateVoucherDto, Object]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('admin/vouchers/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật voucher (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_voucher_dto_1.UpdateVoucherDto, Object]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('admin/vouchers/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa voucher (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "remove", null);
exports.VouchersController = VouchersController = __decorate([
    (0, swagger_1.ApiTags)('Vouchers'),
    (0, common_1.Controller)('api/v1'),
    __metadata("design:paramtypes", [vouchers_service_1.VouchersService])
], VouchersController);
//# sourceMappingURL=vouchers.controller.js.map