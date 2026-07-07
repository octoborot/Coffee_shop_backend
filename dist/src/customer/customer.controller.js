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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const customer_service_1 = require("./customer.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const customer_address_dto_1 = require("./dto/customer-address.dto");
class UpdateProfileDto {
    name;
    email;
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "email", void 0);
let CustomerController = class CustomerController {
    customerService;
    constructor(customerService) {
        this.customerService = customerService;
    }
    getProfile(req) {
        return this.customerService.getProfile(req.user.id);
    }
    updateProfile(req, dto) {
        return this.customerService.updateProfile(req.user.id, dto);
    }
    getAddresses(req) {
        return this.customerService.getAddresses(req.user.id);
    }
    createAddress(req, dto) {
        return this.customerService.createAddress(req.user.id, dto);
    }
    updateAddress(req, id, dto) {
        return this.customerService.updateAddress(req.user.id, id, dto);
    }
    deleteAddress(req, id) {
        return this.customerService.deleteAddress(req.user.id, id);
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({
        summary: 'Lấy thông tin hồ sơ cá nhân (bao gồm địa chỉ và đơn hàng)',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomerController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin cá nhân (tên, email)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], CustomerController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('addresses'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách sổ địa chỉ của khách hàng' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomerController.prototype, "getAddresses", null);
__decorate([
    (0, common_1.Post)('addresses'),
    (0, swagger_1.ApiOperation)({ summary: 'Thêm địa chỉ mới' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_address_dto_1.CreateCustomerAddressDto]),
    __metadata("design:returntype", void 0)
], CustomerController.prototype, "createAddress", null);
__decorate([
    (0, common_1.Patch)('addresses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật địa chỉ' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, customer_address_dto_1.UpdateCustomerAddressDto]),
    __metadata("design:returntype", void 0)
], CustomerController.prototype, "updateAddress", null);
__decorate([
    (0, common_1.Delete)('addresses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa địa chỉ' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CustomerController.prototype, "deleteAddress", null);
exports.CustomerController = CustomerController = __decorate([
    (0, swagger_1.ApiTags)('Customer'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/v1/customer'),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map