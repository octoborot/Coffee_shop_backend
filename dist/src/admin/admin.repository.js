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
exports.AdminRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AdminRepository = class AdminRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRevenue(from, to) {
        const result = await this.prisma.order.aggregate({
            _sum: { total_price_vnd: true },
            where: {
                created_at: { gte: from, lte: to },
                payment_status: 'PAID',
            },
        });
        return result._sum.total_price_vnd ?? 0;
    }
    async countOrdersByStatus() {
        const results = await this.prisma.order.groupBy({
            by: ['status'],
            _count: { id: true },
        });
        const map = {};
        for (const r of results) {
            map[r.status] = r._count.id;
        }
        for (const status of Object.values(client_1.OrderStatus)) {
            if (!(status in map))
                map[status] = 0;
        }
        return map;
    }
    countActiveCustomers() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return this.prisma.customer.count({
            where: { orders: { some: { created_at: { gte: thirtyDaysAgo } } } },
        });
    }
    async getTopProducts(limit = 5) {
        const results = await this.prisma.orderItem.groupBy({
            by: ['name'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: limit,
        });
        return results.map((r) => ({
            name: r.name,
            total_sold: r._sum.quantity ?? 0,
        }));
    }
    async getOrderStats() {
        const [totalOrders, totalRevenue] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.aggregate({
                _sum: { total_price_vnd: true },
                where: { payment_status: 'PAID' },
            }),
        ]);
        return {
            total_orders: totalOrders,
            total_revenue: totalRevenue._sum.total_price_vnd ?? 0,
        };
    }
};
exports.AdminRepository = AdminRepository;
exports.AdminRepository = AdminRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminRepository);
//# sourceMappingURL=admin.repository.js.map