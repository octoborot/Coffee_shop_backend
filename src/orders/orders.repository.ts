import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from '@prisma/client';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Lấy giá sản phẩm từ DB để tính lại total ──────────────────────────────
  getProductsByIds(productIds: string[]) {
    return this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, price_vnd: true },
    });
  }

  // ─── Lookup methods ─────────────────────────────────────────────────────────
  getVoucherById(voucherId: string) {
    return this.prisma.voucher.findUnique({ where: { id: voucherId } });
  }

  getCustomerAddressById(addressId: string) {
    return this.prisma.customerAddress.findUnique({ where: { id: addressId } });
  }

  getStoreLocationById(locationId: string) {
    return this.prisma.storeLocation.findUnique({ where: { id: locationId } });
  }

  // ─── Tạo Order + OrderItems trong 1 transaction ──────────────────────────────
  async createOrderWithItems(data: {
    id: string;
    customer_id?: string;
    customer_address_id?: string;
    store_location_id?: string;
    voucher_id?: string;
    handled_by_admin_id?: string;
    customer_name?: string;
    customer_phone?: string;
    type: OrderType;
    payment_method: PaymentMethod;
    subtotal_vnd: number;
    discount_vnd?: number;
    shipping_fee_vnd?: number;
    total_price: number;
    total_price_vnd: number;
    payment_status: PaymentStatus;
    note?: string;
    address?: string;
    items: {
      product_id?: string;
      name: string;
      quantity: number;
      price: number;
      price_vnd: number;
      options?: Record<string, string>;
    }[];
  }) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          id: data.id,
          customer_id: data.customer_id,
          customer_address_id: data.customer_address_id,
          store_location_id: data.store_location_id,
          voucher_id: data.voucher_id,
          handled_by_admin_id: data.handled_by_admin_id,
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          type: data.type,
          payment_method: data.payment_method,
          subtotal_vnd: data.subtotal_vnd,
          discount_vnd: data.discount_vnd ?? 0,
          shipping_fee_vnd: data.shipping_fee_vnd ?? 0,
          total_price: data.total_price,
          total_price_vnd: data.total_price_vnd,
          payment_status: data.payment_status,
          note: data.note,
          address: data.address,
          items: {
            create: data.items.map((item) => ({
              product_id: item.product_id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              price_vnd: item.price_vnd,
              options: item.options ?? {},
            })),
          },
        },
        include: { items: true, customer: true },
      });
      return order;
    });
  }

  // ─── Lấy lịch sử đơn hàng của Customer ──────────────────────────────────────
  findByCustomerId(customerId: string) {
    return this.prisma.order.findMany({
      where: { customer_id: customerId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // ─── Lấy chi tiết 1 đơn hàng ─────────────────────────────────────────────────
  findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true, customer: true },
    });
  }

  // ─── Lấy tất cả đơn hàng (Admin) với filter ──────────────────────────────────
  findAll(filters?: { status?: OrderStatus }) {
    return this.prisma.order.findMany({
      where: filters?.status ? { status: filters.status } : undefined,
      include: {
        items: true,
        customer: {
          select: { id: true, name: true, phone: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // ─── Cập nhật trạng thái đơn hàng ───────────────────────────────────────────
  updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  // ─── Cập nhật trạng thái thanh toán ──────────────────────────────────────────
  updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { payment_status: paymentStatus },
    });
  }
}
