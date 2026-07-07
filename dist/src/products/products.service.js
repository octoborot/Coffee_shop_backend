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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const products_repository_1 = require("./products.repository");
let ProductsService = class ProductsService {
    productsRepository;
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    toProductCard(product) {
        return {
            id: product.id,
            name: product.name,
            subname: product.subname,
            category: product.category,
            price: Number(product.price),
            priceVnd: product.price_vnd,
            rating: product.rating ? Number(product.rating) : null,
            image: product.image,
            status: product.status,
            details: product.details,
            description: product.description,
            tags: product.tags.map((tag) => tag.name),
        };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const result = await this.productsRepository.findAll({
            category: query.category,
            status: query.status,
            tag: query.tag,
            search: query.search,
            page,
            limit,
        });
        return {
            data: result.items.map((product) => this.toProductCard(product)),
            meta: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    }
    async findOne(id) {
        const product = await this.productsRepository.findById(id);
        if (!product) {
            throw new common_1.NotFoundException(`Sản phẩm với ID ${id} không tồn tại`);
        }
        return this.toProductCard(product);
    }
    async create(dto, adminId) {
        const product = await this.productsRepository.create(dto, adminId);
        return this.toProductCard(product);
    }
    async update(id, dto, adminId) {
        await this.ensureProductExists(id);
        const product = await this.productsRepository.update(id, dto, adminId);
        return this.toProductCard(product);
    }
    async remove(id) {
        await this.ensureProductExists(id);
        await this.productsRepository.delete(id);
        return { message: 'Đã xóa sản phẩm thành công.' };
    }
    async createTag(productId, dto, adminId) {
        await this.ensureProductExists(productId);
        return this.productsRepository.createTag(productId, dto.name, adminId);
    }
    async updateTag(tagId, dto, adminId) {
        if (!dto.name) {
            return { message: 'Không có dữ liệu cần cập nhật.' };
        }
        return this.productsRepository.updateTag(tagId, dto.name, adminId);
    }
    async removeTag(tagId) {
        await this.productsRepository.deleteTag(tagId);
        return { message: 'Đã xóa tag sản phẩm thành công.' };
    }
    async ensureProductExists(id) {
        const product = await this.productsRepository.findById(id);
        if (!product) {
            throw new common_1.NotFoundException(`Sản phẩm với ID ${id} không tồn tại`);
        }
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_repository_1.ProductsRepository])
], ProductsService);
//# sourceMappingURL=products.service.js.map