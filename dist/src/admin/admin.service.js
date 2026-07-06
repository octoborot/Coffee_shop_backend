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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const admin_repository_1 = require("./admin.repository");
let AdminService = class AdminService {
    adminRepository;
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async getDashboard() {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        weekStart.setHours(0, 0, 0, 0);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const [revenueToday, revenueWeek, revenueMonth, ordersByStatus, activeCustomers, topProducts, orderStats,] = await Promise.all([
            this.adminRepository.getRevenue(todayStart, now),
            this.adminRepository.getRevenue(weekStart, now),
            this.adminRepository.getRevenue(monthStart, now),
            this.adminRepository.countOrdersByStatus(),
            this.adminRepository.countActiveCustomers(),
            this.adminRepository.getTopProducts(5),
            this.adminRepository.getOrderStats(),
        ]);
        return {
            revenue: {
                today: revenueToday,
                this_week: revenueWeek,
                this_month: revenueMonth,
            },
            orders: {
                total: orderStats.total_orders,
                by_status: ordersByStatus,
            },
            customers: {
                active_last_30_days: activeCustomers,
            },
            top_products: topProducts,
            total_revenue: orderStats.total_revenue,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_repository_1.AdminRepository])
], AdminService);
//# sourceMappingURL=admin.service.js.map