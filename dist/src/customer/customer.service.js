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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const customer_repository_1 = require("./customer.repository");
let CustomerService = class CustomerService {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async getProfile(customerId) {
        const customer = await this.customerRepository.findById(customerId);
        if (!customer)
            throw new common_1.NotFoundException('Không tìm thấy thông tin khách hàng.');
        return {
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            avatar_text: customer.avatar_text,
            created_at: customer.created_at,
            addresses: customer.addresses,
            recent_orders: customer.orders,
        };
    }
    async updateProfile(customerId, data) {
        const customer = await this.customerRepository.findById(customerId);
        if (!customer)
            throw new common_1.NotFoundException('Không tìm thấy thông tin khách hàng.');
        return this.customerRepository.update(customerId, data);
    }
    getAddresses(customerId) {
        return this.customerRepository.getAddresses(customerId);
    }
    createAddress(customerId, dto) {
        return this.customerRepository.createAddress(customerId, dto);
    }
    async updateAddress(customerId, addressId, dto) {
        const address = await this.customerRepository.getAddressById(addressId);
        if (!address)
            throw new common_1.NotFoundException('Không tìm thấy địa chỉ.');
        if (address.customer_id !== customerId)
            throw new common_1.ForbiddenException('Bạn không có quyền sửa địa chỉ này.');
        return this.customerRepository.updateAddress(customerId, addressId, dto);
    }
    async deleteAddress(customerId, addressId) {
        const address = await this.customerRepository.getAddressById(addressId);
        if (!address)
            throw new common_1.NotFoundException('Không tìm thấy địa chỉ.');
        if (address.customer_id !== customerId)
            throw new common_1.ForbiddenException('Bạn không có quyền xoá địa chỉ này.');
        return this.customerRepository.deleteAddress(addressId);
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_repository_1.CustomerRepository])
], CustomerService);
//# sourceMappingURL=customer.service.js.map