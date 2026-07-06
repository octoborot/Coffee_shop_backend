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
      where: { last_purchase: { gte: thirtyDaysAgo } },
    });
  }

  // ─── Top sản phẩm bán chạy ────────────────────────────────────────────────
  async getTopProducts(limit = 5) {
    const results = await this.prisma.orderItem.groupBy({
      by: ['name'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });
    return results.map((r) => ({
      name: r.name,
      total_sold: r._sum.quantity ?? 0,
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
