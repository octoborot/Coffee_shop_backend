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
exports.CartRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let CartRepository = class CartRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findCartByCustomerId(customerId) {
        return this.prisma.cart.findUnique({
            where: { customer_id: customerId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                    orderBy: {
                        created_at: 'asc',
                    },
                },
            },
        });
    }
    createCart(customerId) {
        return this.prisma.cart.create({
            data: {
                customer_id: customerId,
            },
        });
    }
    async findOrCreateCart(customerId) {
        const cart = await this.findCartByCustomerId(customerId);
        if (cart) {
            return cart;
        }
        await this.createCart(customerId);
        const createdCart = await this.findCartByCustomerId(customerId);
        if (!createdCart) {
            throw new Error('Không thể tạo giỏ hàng.');
        }
        return createdCart;
    }
    findProductById(productId) {
        return this.prisma.product.findUnique({
            where: { id: productId },
        });
    }
    findAvailableProductById(productId) {
        return this.prisma.product.findFirst({
            where: {
                id: productId,
                status: client_1.ProductStatus.Available,
            },
        });
    }
    createCartItem(data) {
        return this.prisma.cartItem.create({
            data,
        });
    }
    updateCartItem(itemId, data) {
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data,
        });
    }
    deleteCartItem(itemId) {
        return this.prisma.cartItem.delete({
            where: { id: itemId },
        });
    }
    deleteCartItems(cartId) {
        return this.prisma.cartItem.deleteMany({
            where: {
                cart_id: cartId,
            },
        });
    }
    findCartItemByIdAndCustomerId(itemId, customerId) {
        return this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cart: {
                    customer_id: customerId,
                },
            },
            include: {
                product: true,
            },
        });
    }
};
exports.CartRepository = CartRepository;
exports.CartRepository = CartRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartRepository);
//# sourceMappingURL=cart.repository.js.map