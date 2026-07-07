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
exports.ProductsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsRepository = class ProductsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { category, status, tag, search, page, limit } = params;
        const where = {
            ...(category ? { category } : {}),
            ...(status ? { status } : {}),
            ...(tag
                ? {
                    tags: {
                        some: {
                            name: { equals: tag, mode: 'insensitive' },
                        },
                    },
                }
                : {}),
            ...(search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { subname: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                        { details: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: { tags: { orderBy: { name: 'asc' } } },
                orderBy: { created_at: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return { items, total };
    }
    findById(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { tags: { orderBy: { name: 'asc' } } },
        });
    }
    create(data, adminId) {
        const { tags, ...productData } = data;
        return this.prisma.product.create({
            data: {
                ...productData,
                created_by_admin_id: adminId,
                updated_by_admin_id: adminId,
                tags: tags?.length
                    ? {
                        create: tags.map((name) => ({
                            name,
                            created_by_admin_id: adminId,
                            updated_by_admin_id: adminId,
                        })),
                    }
                    : undefined,
            },
            include: { tags: { orderBy: { name: 'asc' } } },
        });
    }
    update(id, data, adminId) {
        const { tags: _tags, ...productData } = data;
        return this.prisma.product.update({
            where: { id },
            data: {
                ...productData,
                updated_by_admin_id: adminId,
            },
            include: { tags: { orderBy: { name: 'asc' } } },
        });
    }
    delete(id) {
        return this.prisma.product.delete({
            where: { id },
        });
    }
    createTag(productId, name, adminId) {
        return this.prisma.productTag.create({
            data: {
                product_id: productId,
                name,
                created_by_admin_id: adminId,
                updated_by_admin_id: adminId,
            },
        });
    }
    updateTag(tagId, name, adminId) {
        return this.prisma.productTag.update({
            where: { id: tagId },
            data: {
                name,
                updated_by_admin_id: adminId,
            },
        });
    }
    deleteTag(tagId) {
        return this.prisma.productTag.delete({
            where: { id: tagId },
        });
    }
};
exports.ProductsRepository = ProductsRepository;
exports.ProductsRepository = ProductsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsRepository);
//# sourceMappingURL=products.repository.js.map