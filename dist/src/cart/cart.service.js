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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const cart_repository_1 = require("./cart.repository");
let CartService = class CartService {
    cartRepository;
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async getCart(customerId) {
        const cart = await this.cartRepository.findOrCreateCart(customerId);
        return this.formatCart(cart);
    }
    async addItem(customerId, dto) {
        const product = await this.cartRepository.findAvailableProductById(dto.product_id);
        if (!product) {
            throw new common_1.BadRequestException('Sản phẩm không tồn tại hoặc đã hết hàng.');
        }
        const cart = await this.cartRepository.findOrCreateCart(customerId);
        const existingItem = cart.items.find((item) => {
            return (item.product_id === dto.product_id &&
                this.stringifyOptions(item.options) ===
                    this.stringifyOptions(dto.options));
        });
        if (existingItem) {
            await this.cartRepository.updateCartItem(existingItem.id, {
                quantity: existingItem.quantity + dto.quantity,
            });
        }
        else {
            await this.cartRepository.createCartItem({
                cart_id: cart.id,
                product_id: dto.product_id,
                quantity: dto.quantity,
                options: dto.options,
            });
        }
        return this.getCart(customerId);
    }
    async clearCart(customerId) {
        const cart = await this.cartRepository.findOrCreateCart(customerId);
        await this.cartRepository.deleteCartItems(cart.id);
        return this.getCart(customerId);
    }
    async updateItem(customerId, itemId, dto) {
        const item = await this.cartRepository.findCartItemByIdAndCustomerId(itemId, customerId);
        if (!item) {
            throw new common_1.NotFoundException('Sản phẩm trong giỏ hàng không tồn tại');
        }
        await this.cartRepository.updateCartItem(itemId, {
            quantity: dto.quantity,
            options: dto.options,
        });
        return this.getCart(customerId);
    }
    async removeItem(customerId, itemId) {
        const item = await this.cartRepository.findCartItemByIdAndCustomerId(itemId, customerId);
        if (!item) {
            throw new common_1.NotFoundException('Sản phẩm trong giỏ hàng không tồn tại');
        }
        await this.cartRepository.deleteCartItem(itemId);
        return this.getCart(customerId);
    }
    formatCart(cart) {
        const items = cart.items.map((item) => {
            const lineTotalVnd = item.product.price_vnd * item.quantity;
            return {
                id: item.id,
                product_id: item.product_id,
                quantity: item.quantity,
                options: item.options,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    subname: item.product.subname,
                    price_vnd: item.product.price_vnd,
                    image: item.product.image,
                    status: item.product.status,
                },
                line_total_vnd: lineTotalVnd,
            };
        });
        const subtotalVnd = items.reduce((sum, item) => {
            return sum + item.line_total_vnd;
        }, 0);
        return {
            id: cart.id,
            customer_id: cart.customer_id,
            items,
            subtotal_vnd: subtotalVnd,
        };
    }
    stringifyOptions(options) {
        if (options == null) {
            return '{}';
        }
        if (typeof options !== 'object' || Array.isArray(options)) {
            return JSON.stringify(options);
        }
        return JSON.stringify(options, Object.keys(options).sort());
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_repository_1.CartRepository])
], CartService);
//# sourceMappingURL=cart.service.js.map