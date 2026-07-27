import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Tổng doanh thu theo khoảng thời gian ────────────────────────────────────
  async getRevenue(from: Date, to: Date): Promise<number> {
    const result = await this.prisma.order.aggregate({
      _sum: { total_price_vnd: true },
      where: {
        created_at: { gte: from, lte: to },
        payment_status: 'PAID',
      },
    });
    return result._sum.total_price_vnd ?? 0;
  }

  // ─── Đếm đơn hàng theo từng trạng thái ──────────────────────────────────────
  async countOrdersByStatus(): Promise<Record<string, number>> {
    const results = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const map: Record<string, number> = {};
    for (const r of results) {
      map[r.status] = r._count.id;
    }
    // Điền 0 cho các trạng thái chưa có đơn
    for (const status of Object.values(OrderStatus)) {
      if (!(status in map)) map[status] = 0;
    }
    return map;
  }

  // ─── Đếm khách hàng active trong 30 ngày ────────────────────────────────────
  countActiveCustomers(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.prisma.customer.count({
      where: { orders: { some: { created_at: { gte: thirtyDaysAgo } } } },
    });
  }

  // ─── Top sản phẩm bán chạy ────────────────────────────────────────────────
  async getTopProducts(limit = 5) {
    const results = await this.prisma.orderItem.groupBy({
      by: ['product_id', 'name'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const productIds = results
      .map((item) => item.product_id)
      .filter((id): id is string => Boolean(id));
    const products = productIds.length
      ? await this.prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true, image: true },
        })
      : [];
    const productMap = new Map(products.map((product) => [product.id, product]));

    return results.map((r) => ({
      product_id: r.product_id ?? r.name,
      product_name: r.product_id
        ? (productMap.get(r.product_id)?.name ?? r.name)
        : r.name,
      product_image: r.product_id
        ? (productMap.get(r.product_id)?.image ?? null)
        : null,
      total_quantity: r._sum.quantity ?? 0,
    }));
  }

  // ─── Tổng số đơn hàng và tổng doanh thu ─────────────────────────────────────
  async getOrderStats() {
    const [totalOrders, totalRevenue] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { total_price_vnd: true },
        where: { payment_status: 'PAID' },
      }),
    ]);
    return {
      total_orders: totalOrders,
      total_revenue: totalRevenue._sum.total_price_vnd ?? 0,
    };
  }
}
