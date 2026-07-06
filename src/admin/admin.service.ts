import { Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getDashboard() {
    const now = new Date();

    // Hôm nay: từ 00:00 đến hiện tại
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    // Tuần này: từ đầu tuần (Thứ 2) đến hiện tại
    const weekStart = new Date(now);
    weekStart.setDate(
      now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1),
    );
    weekStart.setHours(0, 0, 0, 0);

    // Tháng này: từ ngày 1 đến hiện tại
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      revenueToday,
      revenueWeek,
      revenueMonth,
      ordersByStatus,
      activeCustomers,
      topProducts,
      orderStats,
    ] = await Promise.all([
      this.adminRepository.getRevenue(todayStart, now),
      this.adminRepository.getRevenue(weekStart, now),
      this.adminRepository.getRevenue(monthStart, now),
      this.adminRepository.countOrdersByStatus(),
      this.adminRepository.countActiveCustomers(),
      this.adminRepository.getTopProducts(5),
      this.adminRepository.getOrderStats(),
    ]);

    return {
      revenue: {
        today: revenueToday,
        this_week: revenueWeek,
        this_month: revenueMonth,
      },
      orders: {
        total: orderStats.total_orders,
        by_status: ordersByStatus,
      },
      customers: {
        active_last_30_days: activeCustomers,
      },
      top_products: topProducts,
      total_revenue: orderStats.total_revenue,
    };
  }
}
