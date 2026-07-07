import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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
      const custAddress = await this.ordersRepository.getCustomerAddressById(dto.customer_address_id);
      if (!custAddress) throw new BadRequestException('Địa chỉ giao hàng không hợp lệ.');
      address = custAddress.address;
      customerName = custAddress.receiver || customerName;
      customerPhone = custAddress.phone || customerPhone;
    }

    // Resolve store location
    if (dto.store_location_id) {
      const store = await this.ordersRepository.getStoreLocationById(dto.store_location_id);
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
      const voucher = await this.ordersRepository.getVoucherById(dto.voucher_id);
      if (!voucher || !voucher.is_active) {
        throw new BadRequestException('Voucher không hợp lệ hoặc đã hết hạn.');
      }
      if (subtotalVnd < voucher.min_order_vnd) {
        throw new BadRequestException(`Voucher yêu cầu đơn tối thiểu ${voucher.min_order_vnd}đ.`);
      }

      if (voucher.discount_type === 'FIXED_AMOUNT') {
        discountVnd = voucher.discount_value;
      } else if (voucher.discount_type === 'PERCENT') {
        discountVnd = (subtotalVnd * voucher.discount_value) / 100;
        if (voucher.max_discount_vnd && discountVnd > voucher.max_discount_vnd) {
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

    return { order };
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
