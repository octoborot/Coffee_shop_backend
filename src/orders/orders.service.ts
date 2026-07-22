import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '@prisma/client';
import { OrdersRepository } from './orders.repository';
import { OrdersGateway } from '../gateway/orders.gateway';
import { ZaloPayService } from '../zalopay/zalopay.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderPaymentStatusDto } from './dto/update-order-payment-status.dto';
import { RejectOrderDto } from './dto/reject-order.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly ordersGateway: OrdersGateway,
    private readonly zaloPayService: ZaloPayService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Tạo mã đơn hàng ngẫu nhiên: #BB-XXXX ──────────────────────────────────
  private generateOrderId(): string {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `#BB-${num}`;
  }

  // ─── Tạo đơn hàng mới ────────────────────────────────────────────────────────
  async createOrder(dto: CreateOrderDto, customerId?: string) {
    // Validation: Delivery phải có địa chỉ
    if (dto.type === 'Delivery' && !dto.address && !dto.customer_address_id) {
      throw new BadRequestException('Vui lòng cung cấp địa chỉ giao hàng.');
    }

    let address = dto.address;
    let customerName = dto.customer_name;
    let customerPhone = dto.customer_phone;

    // Resolve address from DB if customer_address_id is provided
    if (dto.customer_address_id) {
      const custAddress = await this.ordersRepository.getCustomerAddressById(
        dto.customer_address_id,
      );
      if (!custAddress)
        throw new BadRequestException('Địa chỉ giao hàng không hợp lệ.');
      address = custAddress.address;
      customerName = custAddress.receiver || customerName;
      customerPhone = custAddress.phone || customerPhone;
    }

    // Resolve store location
    if (dto.store_location_id) {
      const store = await this.ordersRepository.getStoreLocationById(
        dto.store_location_id,
      );
      if (!store) throw new BadRequestException('Cửa hàng không tồn tại.');
    }

    // Lấy giá sản phẩm từ DB (không tin giá FE gửi lên)
    const productIds = dto.items.map((i) => i.product_id);
    const products = await this.ordersRepository.getProductsByIds(productIds);

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Tính tổng tiền và chuẩn bị danh sách items
    let subtotalVnd = 0;
    const itemsData = dto.items.map((item) => {
      const product = productMap.get(item.product_id);
      if (!product) {
        throw new BadRequestException(
          `Sản phẩm ${item.product_id} không tồn tại.`,
        );
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
      shippingFeeVnd = 15000; // Phí ship mặc định
    }

    let discountVnd = 0;
    if (dto.voucher_id) {
      const voucher = await this.ordersRepository.getVoucherById(
        dto.voucher_id,
      );
      if (!voucher || !voucher.is_active) {
        throw new BadRequestException('Voucher không hợp lệ hoặc đã hết hạn.');
      }
      if (subtotalVnd < voucher.min_order_vnd) {
        throw new BadRequestException(
          `Voucher yêu cầu đơn tối thiểu ${voucher.min_order_vnd}đ.`,
        );
      }

      if (voucher.discount_type === 'FIXED_AMOUNT') {
        discountVnd = voucher.discount_value;
      } else if (voucher.discount_type === 'PERCENT') {
        discountVnd = (subtotalVnd * voucher.discount_value) / 100;
        if (
          voucher.max_discount_vnd &&
          discountVnd > voucher.max_discount_vnd
        ) {
          discountVnd = voucher.max_discount_vnd;
        }
      }
      // TODO: Xử lý thêm loại BUY_ONE_GET_ONE nếu cần
    }

    let totalVnd = subtotalVnd + shippingFeeVnd - discountVnd;
    if (totalVnd < 0) totalVnd = 0;

    const totalPrice = totalVnd / 25000; // quy đổi sang USD (tượng trưng)

    // Tạo order trong DB
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

    // Emit sự kiện real-time đến Admin Dashboard
    this.ordersGateway.emitNewOrder(order);

    // Xử lý tạo link ZaloPay nếu chọn thanh toán qua ZaloPay
    let zaloPayResult: any = null;
    if (dto.payment_method === 'ZALOPAY') {
      // trans_id format: yyMMdd_xxxxx
      const now = new Date();
      const yy = now.getFullYear().toString().slice(2);
      const mm = (now.getMonth() + 1).toString().padStart(2, '0');
      const dd = now.getDate().toString().padStart(2, '0');
      const transId = `${yy}${mm}${dd}_${orderId.replace('#BB-', '')}`;

      zaloPayResult = await this.zaloPayService.createZaloPayOrder(
        transId,
        totalVnd,
        `Thanh toan don hang ${orderId}`,
        itemsData,
      );
    }

    return { order, zalopay: zaloPayResult };
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

  async updateCustomerPaymentMethod(
    id: string,
    customerId: string,
    dto: UpdatePaymentMethodDto,
  ) {
    const currentOrder = await this.ordersRepository.findById(id);
    if (!currentOrder) {
      throw new NotFoundException(`Don hang ${id} khong ton tai.`);
    }
    if (currentOrder.customer_id !== customerId) {
      throw new ForbiddenException('Ban khong co quyen cap nhat don hang nay.');
    }
    if (currentOrder.status === OrderStatus.New) {
      throw new BadRequestException('Don hang chua duoc quan xac nhan.');
    }
    if (currentOrder.status === OrderStatus.Cancelled) {
      throw new BadRequestException('Don hang da bi tu choi.');
    }
    if (currentOrder.payment_status === 'PAID') {
      throw new BadRequestException('Don hang da thanh toan.');
    }

    const marker = '[PAYMENT_SELECTED]';
    const note = (currentOrder.note ?? '').includes(marker)
      ? currentOrder.note ?? undefined
      : [currentOrder.note, marker].filter(Boolean).join('\n');

    const order = await this.ordersRepository.updatePaymentMethod(
      id,
      dto.payment_method,
      note,
    );
    this.ordersGateway.emitOrderUpdated(order);

    let zaloPayResult: any = null;
    if (dto.payment_method === 'ZALOPAY') {
      zaloPayResult = await this.createZaloPayPayment(order);
    }

    return { order, zalopay: zaloPayResult };
  }

  // ─── Cập nhật trạng thái đơn hàng (Admin) ───────────────────────────────────
  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.ordersRepository.updateStatus(id, dto.status);
    this.ordersGateway.emitOrderUpdated(order);
    return order;
  }

  async rejectOrder(id: string, dto: RejectOrderDto) {
    const currentOrder = await this.ordersRepository.findById(id);
    if (!currentOrder) {
      throw new NotFoundException(`Don hang ${id} khong ton tai.`);
    }

    const marker = '[ADMIN_REJECT_REASON]';
    const cleanNote = (currentOrder.note ?? '').split(marker)[0].trim();
    const note = [cleanNote, `${marker}${dto.reason.trim()}`]
      .filter(Boolean)
      .join('\n');

    const order = await this.ordersRepository.updateStatusAndNote(
      id,
      OrderStatus.Cancelled,
      note,
    );
    this.ordersGateway.emitOrderUpdated(order);
    return order;
  }

  // ─── Cập nhật trạng thái thanh toán (Admin) ───────────────────────────────────
  async updateOrderPaymentStatus(id: string, dto: UpdateOrderPaymentStatusDto) {
    const order = await this.ordersRepository.updatePaymentStatus(
      id,
      dto.payment_status,
    );
    this.ordersGateway.emitOrderUpdated(order);
    return order;
  }

  async handleZaloPayCallback(data: string, mac: string) {
    const callbackData = this.zaloPayService.verifyCallback(data, mac);
    const appTransId = callbackData.app_trans_id as string | undefined;
    const orderNumber = appTransId?.split('_').pop();

    if (!orderNumber) {
      throw new BadRequestException('Callback ZaloPay thiếu app_trans_id.');
    }

    const orderId = `#BB-${orderNumber}`;
    const order = await this.ordersRepository.updatePaymentStatus(
      orderId,
      'PAID',
    );
    this.ordersGateway.emitOrderUpdated(order);
    return order;
  }

  async handleBankTransferWebhook(
    payload: Record<string, unknown>,
    webhookSecret?: string,
  ) {
    const configuredSecret = this.configService.get<string>(
      'BANK_WEBHOOK_SECRET',
    );
    if (configuredSecret && webhookSecret !== configuredSecret) {
      throw new ForbiddenException('Webhook secret không hợp lệ.');
    }

    const transaction = this.extractBankTransaction(payload);
    const orderId = this.extractOrderId(transaction.description);
    if (!orderId) {
      throw new BadRequestException(
        'Không tìm thấy mã đơn hàng trong nội dung chuyển khoản.',
      );
    }

    const order = await this.ordersRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Đơn hàng ${orderId} không tồn tại.`);
    }
    if (order.payment_method !== 'BANK_TRANSFER') {
      throw new BadRequestException(
        `Đơn hàng ${orderId} không dùng phương thức chuyển khoản.`,
      );
    }
    if (transaction.amount < order.total_price_vnd) {
      throw new BadRequestException(
        `Số tiền chuyển khoản chưa đủ cho đơn hàng ${orderId}.`,
      );
    }

    const paidOrder = await this.ordersRepository.updatePaymentStatus(
      orderId,
      'PAID',
    );
    this.ordersGateway.emitOrderUpdated(paidOrder);
    return paidOrder;
  }

  private extractBankTransaction(payload: Record<string, unknown>) {
    const data = (payload.data ?? payload) as Record<string, unknown>;
    const description = String(
      data.description ??
        data.content ??
        data.transferContent ??
        data.orderCode ??
        '',
    );
    const amount = Number(
      data.amount ??
        data.transferAmount ??
        data.creditAmount ??
        data.transactionAmount ??
        0,
    );

    if (!description || !Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException(
        'Webhook chuyển khoản thiếu nội dung hoặc số tiền giao dịch.',
      );
    }

    return { description, amount };
  }

  private extractOrderId(description: string) {
    const normalized = description.toUpperCase();
    const match = normalized.match(/#?BB[-\s]?(\d{4,})/);
    return match ? `#BB-${match[1]}` : null;
  }

  private createZaloPayPayment(order: {
    id: string;
    total_price_vnd: number;
    items?: {
      name: string;
      quantity: number;
      price: unknown;
      price_vnd: number;
      options?: unknown;
    }[];
  }) {
    const now = new Date();
    const yy = now.getFullYear().toString().slice(2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    const transId = `${yy}${mm}${dd}_${order.id.replace('#BB-', '')}`;

    return this.zaloPayService.createZaloPayOrder(
      transId,
      order.total_price_vnd,
      `Thanh toan don hang ${order.id}`,
      (order.items ?? []).map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    );
  }
}
