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
exports.NotificationsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsRepository = class NotificationsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { customerId, type, is_read, page, limit, includeSystem } = params;
        const where = {
            ...(type ? { type } : {}),
            ...(typeof is_read === 'boolean' ? { is_read } : {}),
            ...(customerId
                ? includeSystem
                    ? { OR: [{ customer_id: customerId }, { customer_id: null }] }
                    : { customer_id: customerId }
                : {}),
        };
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                orderBy: { created_at: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.notification.count({ where }),
        ]);
        return { items, total };
    }
    findById(id) {
        return this.prisma.notification.findUnique({ where: { id } });
    }
    create(data, adminId) {
        return this.prisma.notification.create({
            data: {
                ...data,
                created_by_admin_id: adminId,
            },
        });
    }
    update(id, data) {
        return this.prisma.notification.update({ where: { id }, data });
    }
    markAsRead(id) {
        return this.prisma.notification.update({
            where: { id },
            data: { is_read: true },
        });
    }
    delete(id) {
        return this.prisma.notification.delete({ where: { id } });
    }
};
exports.NotificationsRepository = NotificationsRepository;
exports.NotificationsRepository = NotificationsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsRepository);
//# sourceMappingURL=notifications.repository.js.map