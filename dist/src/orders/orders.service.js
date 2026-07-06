"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
const orders_repository_1 = require("./orders.repository");
const orders_gateway_1 = require("../gateway/orders.gateway");
let OrdersService = class OrdersService {
    ordersRepository;
    ordersGateway;
    configService;
    constructor(ordersRepository, ordersGateway, configService) {
        this.ordersRepository = ordersRepository;
        this.ordersGateway = ordersGateway;
        this.configService = configService;
    }
    generateOrderId() {
        const num = Math.floor(1000 + Math.random() * 9000);
        return `#BB-${num}`;
    }
    calculatePoints(totalVnd) {
        return Math.floor(totalVnd / 10000);
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
            total_price: totalPrice,
            total_price_vnd: totalVnd,
            payment_status: 'UNPAID',
            note: dto.note,
            address: dto.address,
            items: itemsData.map(i => ({
                ...i,
                price: Number(i.price),
            })),
        });
        if (customerId) {
            const points = this.calculatePoints(totalVnd);
            if (points > 0) {
                await this.ordersRepository.addPointsToCustomer(customerId, points);
            }
        }
        this.ordersGateway.emitNewOrder(order);
        if (dto.payment_method === 'zalopay') {
            const zpToken = await this.createZaloPayOrder(order.id, totalVnd);
            return { order, zp_trans_token: zpToken };
        }
        return { order };
    }
    async createZaloPayOrder(orderId, amount) {
        const appId = this.configService.getOrThrow('ZALOPAY_APP_ID');
        const key1 = this.configService.getOrThrow('ZALOPAY_KEY1');
        const endpoint = this.configService.getOrThrow('ZALOPAY_ENDPOINT');
        const appTransId = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${orderId.replace('#', '')}`;
        const appTime = Date.now();
        const embedData = JSON.stringify({ orderId });
        const items = JSON.stringify([]);
        const rawSignature = `${appId}|${appTransId}|Coffee Shop|${amount}|${appTime}|${embedData}|${items}`;
        const mac = crypto.createHmac('sha256', key1).update(rawSignature).digest('hex');
        const payload = {
            app_id: Number(appId),
            app_trans_id: appTransId,
            app_user: 'coffee_shop_customer',
            app_time: appTime,
            item: items,
            embed_data: embedData,
            amount,
            description: `Coffee Shop - Thanh toán đơn hàng ${orderId}`,
            bank_code: '',
            mac,
        };
        try {
            const res = await axios_1.default.post(endpoint, null, { params: payload });
            return res.data?.zp_trans_token ?? null;
        }
        catch {
            return null;
        }
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
        orders_gateway_1.OrdersGateway,
        config_1.ConfigService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map