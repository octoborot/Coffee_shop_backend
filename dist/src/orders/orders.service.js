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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const orders_repository_1 = require("./orders.repository");
const orders_gateway_1 = require("../gateway/orders.gateway");
let OrdersService = class OrdersService {
    ordersRepository;
    ordersGateway;
    constructor(ordersRepository, ordersGateway) {
        this.ordersRepository = ordersRepository;
        this.ordersGateway = ordersGateway;
    }
    generateOrderId() {
        const num = Math.floor(1000 + Math.random() * 9000);
        return `#BB-${num}`;
    }
    async createOrder(dto, customerId) {
        if (dto.type === 'Delivery' && !dto.address) {
            throw new common_1.BadRequestException('Vui lòng nhập địa chỉ giao hàng.');
        }
        const productIds = dto.items.map((i) => i.product_id);
        const products = await this.ordersRepository.getProductsByIds(productIds);
        const productMap = new Map(products.map((p) => [p.id, p]));
        let totalVnd = 0;
        const itemsData = dto.items.map((item) => {
            const product = productMap.get(item.product_id);
            if (!product) {
                throw new common_1.BadRequestException(`Sản phẩm ${item.product_id} không tồn tại.`);
            }
            const itemTotalVnd = product.price_vnd * item.quantity;
            totalVnd += itemTotalVnd;
            return {
                product_id: item.product_id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                price_vnd: product.price_vnd,
                options: item.options,
            };
        });
        const totalPrice = totalVnd / 25000;
        const orderId = this.generateOrderId();
        const order = await this.ordersRepository.createOrderWithItems({
            id: orderId,
            customer_id: customerId,
            customer_name: dto.customer_name,
            customer_phone: dto.customer_phone,
            type: dto.type,
            payment_method: dto.payment_method,
            subtotal_vnd: totalVnd,
            discount_vnd: 0,
            shipping_fee_vnd: 0,
            total_price: totalPrice,
            total_price_vnd: totalVnd,
            payment_status: 'UNPAID',
            note: dto.note,
            address: dto.address,
            items: itemsData.map((i) => ({
                ...i,
                price: Number(i.price),
            })),
        });
        this.ordersGateway.emitNewOrder(order);
        return { order };
    }
    getOrderHistory(customerId) {
        return this.ordersRepository.findByCustomerId(customerId);
    }
    async getOrderById(id) {
        const order = await this.ordersRepository.findById(id);
        if (!order)
            throw new common_1.NotFoundException(`Đơn hàng ${id} không tồn tại.`);
        return order;
    }
    getAdminOrders(status) {
        return this.ordersRepository.findAll(status ? { status } : undefined);
    }
    updateOrderStatus(id, dto) {
        return this.ordersRepository.updateStatus(id, dto.status);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_repository_1.OrdersRepository,
        orders_gateway_1.OrdersGateway])
], OrdersService);
//# sourceMappingURL=orders.service.js.map