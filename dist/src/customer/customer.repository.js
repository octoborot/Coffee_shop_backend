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
exports.CustomerRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomerRepository = class CustomerRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findById(id) {
        return this.prisma.customer.findUnique({
            where: { id },
            include: {
                addresses: {
                    orderBy: { created_at: 'desc' },
                },
                orders: {
                    orderBy: { created_at: 'desc' },
                    take: 5,
                    include: { items: true },
                },
            },
        });
    }
    update(id, data) {
        return this.prisma.customer.update({
            where: { id },
            data,
        });
    }
    async createAddress(customerId, data) {
        if (data.is_default) {
            await this.prisma.customerAddress.updateMany({
                where: { customer_id: customerId },
                data: { is_default: false },
            });
        }
        return this.prisma.customerAddress.create({
            data: {
                ...data,
                customer_id: customerId,
            },
        });
    }
    getAddresses(customerId) {
        return this.prisma.customerAddress.findMany({
            where: { customer_id: customerId },
            orderBy: { created_at: 'desc' },
        });
    }
    getAddressById(addressId) {
        return this.prisma.customerAddress.findUnique({
            where: { id: addressId },
        });
    }
    async updateAddress(customerId, addressId, data) {
        if (data.is_default) {
            await this.prisma.customerAddress.updateMany({
                where: { customer_id: customerId },
                data: { is_default: false },
            });
        }
        return this.prisma.customerAddress.update({
            where: { id: addressId },
            data,
        });
    }
    deleteAddress(addressId) {
        return this.prisma.customerAddress.delete({
            where: { id: addressId },
        });
    }
};
exports.CustomerRepository = CustomerRepository;
exports.CustomerRepository = CustomerRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerRepository);
//# sourceMappingURL=customer.repository.js.map