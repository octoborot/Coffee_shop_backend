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
const zalopay_service_1 = require("../zalopay/zalopay.service");
let OrdersService = class OrdersService {
    ordersRepository;
    ordersGateway;
    zaloPayService;
    constructor(ordersRepository, ordersGateway, zaloPayService) {
        this.ordersRepository = ordersRepository;
        this.ordersGateway = ordersGateway;
        this.zaloPayService = zaloPayService;
    }
    generateOrderId() {
        const num = Math.floor(1000 + Math.random() * 9000);
        return `#BB-${num}`;
    }
    async createOrder(dto, customerId) {
        if (dto.type === 'Delivery' && !dto.address && !dto.customer_address_id) {
            throw new common_1.BadRequestException('Vui lòng cung cấp địa chỉ giao hàng.');
        }
        let address = dto.address;
        let customerName = dto.customer_name;
        let customerPhone = dto.customer_phone;
        if (dto.customer_address_id) {
            const custAddress = await this.ordersRepository.getCustomerAddressById(dto.customer_address_id);
            if (!custAddress)
                throw new common_1.BadRequestException('Địa chỉ giao hàng không hợp lệ.');
            address = custAddress.address;
            customerName = custAddress.receiver || customerName;
            customerPhone = custAddress.phone || customerPhone;
        }
        if (dto.store_location_id) {
            const store = await this.ordersRepository.getStoreLocationById(dto.store_location_id);
            if (!store)
                throw new common_1.BadRequestException('Cửa hàng không tồn tại.');
        }
        const productIds = dto.items.map((i) => i.product_id);
        const products = await this.ordersRepository.getProductsByIds(productIds);
        const productMap = new Map(products.map((p) => [p.id, p]));
        let subtotalVnd = 0;
        const itemsData = dto.items.map((item) => {
            const product = productMap.get(item.product_id);
            if (!product) {
                throw new common_1.BadRequestException(`Sản phẩm ${item.product_id} không tồn tại.`);
            }
            const itemTotalVnd = product.price_vnd * item.quantity;
            subtotalVnd += itemTotalVnd;
            return {
                product_id: item.product_id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                price_vnd: product.price_vnd,
                options: item.options,
            };
        });
        let shippingFeeVnd = 0;
        if (dto.type === 'Delivery') {
            shippingFeeVnd = 15000;
        }
        let discountVnd = 0;
        if (dto.voucher_id) {
            const voucher = await this.ordersRepository.getVoucherById(dto.voucher_id);
            if (!voucher || !voucher.is_active) {
                throw new common_1.BadRequestException('Voucher không hợp lệ hoặc đã hết hạn.');
            }
            if (subtotalVnd < voucher.min_order_vnd) {
                throw new common_1.BadRequestException(`Voucher yêu cầu đơn tối thiểu ${voucher.min_order_vnd}đ.`);
            }
            if (voucher.discount_type === 'FIXED_AMOUNT') {
                discountVnd = voucher.discount_value;
            }
            else if (voucher.discount_type === 'PERCENT') {
                discountVnd = (subtotalVnd * voucher.discount_value) / 100;
                if (voucher.max_discount_vnd &&
                    discountVnd > voucher.max_discount_vnd) {
                    discountVnd = voucher.max_discount_vnd;
                }
            }
        }
        let totalVnd = subtotalVnd + shippingFeeVnd - discountVnd;
        if (totalVnd < 0)
            totalVnd = 0;
        const totalPrice = totalVnd / 25000;
        const orderId = this.generateOrderId();
        const order = await this.ordersRepository.createOrderWithItems({
            id: orderId,
            customer_id: customerId,
            customer_address_id: dto.customer_address_id,
            store_location_id: dto.store_location_id,
            voucher_id: dto.voucher_id,
            customer_name: customerName,
            customer_phone: customerPhone,
            type: dto.type,
            payment_method: dto.payment_method,
            subtotal_vnd: subtotalVnd,
            discount_vnd: discountVnd,
            shipping_fee_vnd: shippingFeeVnd,
            total_price: totalPrice,
            total_price_vnd: totalVnd,
            payment_status: 'UNPAID',
            note: dto.note,
            address: address,
            items: itemsData.map((i) => ({
                ...i,
                price: Number(i.price),
            })),
        });
        this.ordersGateway.emitNewOrder(order);
        let zaloPayResult = null;
        if (dto.payment_method === 'ZALOPAY') {
            const now = new Date();
            const yy = now.getFullYear().toString().slice(2);
            const mm = (now.getMonth() + 1).toString().padStart(2, '0');
            const dd = now.getDate().toString().padStart(2, '0');
            const transId = `${yy}${mm}${dd}_${orderId.replace('#BB-', '')}`;
            zaloPayResult = await this.zaloPayService.createZaloPayOrder(transId, totalVnd, `Thanh toan don hang ${orderId}`, itemsData);
        }
        return { order, zalopay: zaloPayResult };
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
        zalopay_service_1.ZaloPayService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map