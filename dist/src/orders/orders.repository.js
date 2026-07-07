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
exports.OrdersRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersRepository = class OrdersRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getProductsByIds(productIds) {
        return this.prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true, price: true, price_vnd: true },
        });
    }
    getVoucherById(voucherId) {
        return this.prisma.voucher.findUnique({ where: { id: voucherId } });
    }
    getCustomerAddressById(addressId) {
        return this.prisma.customerAddress.findUnique({ where: { id: addressId } });
    }
    getStoreLocationById(locationId) {
        return this.prisma.storeLocation.findUnique({ where: { id: locationId } });
    }
    async createOrderWithItems(data) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    id: data.id,
                    customer_id: data.customer_id,
                    customer_address_id: data.customer_address_id,
                    store_location_id: data.store_location_id,
                    voucher_id: data.voucher_id,
                    handled_by_admin_id: data.handled_by_admin_id,
                    customer_name: data.customer_name,
                    customer_phone: data.customer_phone,
                    type: data.type,
                    payment_method: data.payment_method,
                    subtotal_vnd: data.subtotal_vnd,
                    discount_vnd: data.discount_vnd ?? 0,
                    shipping_fee_vnd: data.shipping_fee_vnd ?? 0,
                    total_price: data.total_price,
                    total_price_vnd: data.total_price_vnd,
                    payment_status: data.payment_status,
                    note: data.note,
                    address: data.address,
                    items: {
                        create: data.items.map((item) => ({
                            product_id: item.product_id,
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price,
                            price_vnd: item.price_vnd,
                            options: item.options ?? {},
                        })),
                    },
                },
                include: { items: true, customer: true },
            });
            return order;
        });
    }
    findByCustomerId(customerId) {
        return this.prisma.order.findMany({
            where: { customer_id: customerId },
            include: { items: true },
            orderBy: { created_at: 'desc' },
        });
    }
    findById(id) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { items: true, customer: true },
        });
    }
    findAll(filters) {
        return this.prisma.order.findMany({
            where: filters?.status ? { status: filters.status } : undefined,
            include: {
                items: true,
                customer: {
                    select: { id: true, name: true, phone: true },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    updateStatus(id, status) {
        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }
};
exports.OrdersRepository = OrdersRepository;
exports.OrdersRepository = OrdersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersRepository);
//# sourceMappingURL=orders.repository.js.map