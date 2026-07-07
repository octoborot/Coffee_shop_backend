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
exports.VouchersRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VouchersRepository = class VouchersRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { discount_type, category, is_active, search, page, limit, activeOnly, } = params;
        const now = new Date();
        const where = {
            ...(discount_type ? { discount_type } : {}),
            ...(category ? { applicable_categories: { has: category } } : {}),
            ...(typeof is_active === 'boolean' ? { is_active } : {}),
            ...(activeOnly
                ? {
                    is_active: true,
                    OR: [{ starts_at: null }, { starts_at: { lte: now } }],
                    AND: [{ OR: [{ ends_at: null }, { ends_at: { gte: now } }] }],
                }
                : {}),
            ...(search
                ? {
                    OR: [
                        { code: { contains: search, mode: 'insensitive' } },
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.voucher.findMany({
                where,
                orderBy: { created_at: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.voucher.count({ where }),
        ]);
        return { items, total };
    }
    findById(id) {
        return this.prisma.voucher.findUnique({ where: { id } });
    }
    findByCode(code) {
        return this.prisma.voucher.findUnique({ where: { code } });
    }
    create(data, adminId) {
        return this.prisma.voucher.create({
            data: {
                ...data,
                applicable_categories: data.applicable_categories ?? [],
                created_by_admin_id: adminId,
                updated_by_admin_id: adminId,
            },
        });
    }
    update(id, data, adminId) {
        return this.prisma.voucher.update({
            where: { id },
            data: {
                ...data,
                updated_by_admin_id: adminId,
            },
        });
    }
    delete(id) {
        return this.prisma.voucher.delete({ where: { id } });
    }
};
exports.VouchersRepository = VouchersRepository;
exports.VouchersRepository = VouchersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VouchersRepository);
//# sourceMappingURL=vouchers.repository.js.map