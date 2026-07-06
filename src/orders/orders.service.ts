import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { OrderStatus } from '@prisma/client';
import { OrdersRepository } from './orders.repository';
import { OrdersGateway } from '../gateway/orders.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly ordersGateway: OrdersGateway,
    private readonly configService: ConfigService,
  ) {}

  // ─── Tạo mã đơn hàng ngẫu nhiên: #BB-XXXX ──────────────────────────────────
  private generateOrderId(): string {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `#BB-${num}`;
  }

  // ─── Tính điểm thưởng (1 điểm / 10.000 VNĐ) ────────────────────────────────
  private calculatePoints(totalVnd: number): number {
    return Math.floor(totalVnd / 10000);
  }

  // ─── Tạo đơn hàng mới ────────────────────────────────────────────────────────
  async createOrder(dto: CreateOrderDto, customerId?: string) {
    // Validation: Delivery phải có địa chỉ
    if (dto.type === 'Delivery' && !dto.address) {
      throw new BadRequestException('Vui lòng nhập địa chỉ giao hàng.');
    }

    // Lấy giá sản phẩm từ DB (không tin giá FE gửi lên)
    const productIds = dto.items.map((i) => i.product_id);
    const products = await this.ordersRepository.getProductsByIds(productIds);

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Tính tổng tiền và chuẩn bị danh sách items
    let totalVnd = 0;
    const itemsData = dto.items.map((item) => {
      const product = productMap.get(item.product_id);
      if (!product) {
        throw new BadRequestException(`Sản phẩm ${item.product_id} không tồn tại.`);
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

    const totalPrice = totalVnd / 25000; // quy đổi sang USD (tượng trưng)

    // Tạo order trong DB
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

    // Cộng điểm cho Customer đã đăng nhập
    if (customerId) {
      const points = this.calculatePoints(totalVnd);
      if (points > 0) {
        await this.ordersRepository.addPointsToCustomer(customerId, points);
      }
    }

    // Emit sự kiện real-time đến Admin Dashboard
    this.ordersGateway.emitNewOrder(order);

    // Tích hợp ZaloPay nếu khách chọn thanh toán ZaloPay
    if (dto.payment_method === 'zalopay') {
      const zpToken = await this.createZaloPayOrder(order.id, totalVnd);
      return { order, zp_trans_token: zpToken };
    }

    return { order };
  }

  // ─── Tích hợp ZaloPay Sandbox ────────────────────────────────────────────────
  private async createZaloPayOrder(orderId: string, amount: number) {
    const appId = this.configService.getOrThrow<string>('ZALOPAY_APP_ID');
    const key1 = this.configService.getOrThrow<string>('ZALOPAY_KEY1');
    const endpoint = this.configService.getOrThrow<string>('ZALOPAY_ENDPOINT');

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
      const res = await axios.post(endpoint, null, { params: payload });
      return res.data?.zp_trans_token ?? null;
    } catch {
      // ZaloPay lỗi không làm hỏng flow đặt hàng
      return null;
    }
  }

  // ─── Lấy lịch sử đơn hàng của Customer ──────────────────────────────────────
  getOrderHistory(customerId: string) {
    return this.ordersRepository.findByCustomerId(customerId);
  }

  // ─── Lấy chi tiết 1 đơn hàng ─────────────────────────────────────────────────
  async getOrderById(id: string) {
    const order = await this.ordersRepository.findById(id);
    if (!order) throw new NotFoundException(`Đơn hàng ${id} không tồn tại.`);
    return order;
  }

  // ─── Lấy tất cả đơn hàng (Admin) ─────────────────────────────────────────────
  getAdminOrders(status?: OrderStatus) {
    return this.ordersRepository.findAll(status ? { status } : undefined);
  }

  // ─── Cập nhật trạng thái đơn hàng (Admin) ───────────────────────────────────
  updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    return this.ordersRepository.updateStatus(id, dto.status);
  }
}
