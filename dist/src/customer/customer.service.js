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
const client_1 = require("@prisma/client");
const customer_repository_1 = require("./customer.repository");
let CustomerService = class CustomerService {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    calculateMembership(points) {
        if (points >= 500)
            return client_1.MembershipLevel.Diamond;
        if (points >= 200)
            return client_1.MembershipLevel.Gold;
        return client_1.MembershipLevel.Silver;
    }
    async getProfile(customerId) {
        const customer = await this.customerRepository.findById(customerId);
        if (!customer)
            throw new common_1.NotFoundException('Không tìm thấy thông tin khách hàng.');
        const currentMembership = this.calculateMembership(customer.points);
        return {
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            avatar_text: customer.avatar_text,
            member_card_id: customer.member_card_id,
            points: customer.points,
            membership: currentMembership,
            last_purchase: customer.last_purchase,
            created_at: customer.created_at,
            recent_orders: customer.orders,
        };
    }
    async updateProfile(customerId, data) {
        const customer = await this.customerRepository.findById(customerId);
        if (!customer)
            throw new common_1.NotFoundException('Không tìm thấy thông tin khách hàng.');
        return this.customerRepository.update(customerId, data);
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_repository_1.CustomerRepository])
], CustomerService);
//# sourceMappingURL=customer.service.js.map