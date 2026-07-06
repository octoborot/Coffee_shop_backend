import { Injectable, NotFoundException } from '@nestjs/common';
import { MembershipLevel } from '@prisma/client';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  // ─── Tính hạng thành viên dựa trên điểm ────────────────────────────────────
  private calculateMembership(points: number): MembershipLevel {
    if (points >= 500) return MembershipLevel.Diamond;
    if (points >= 200) return MembershipLevel.Gold;
    return MembershipLevel.Silver;
  }

  // ─── Lấy Profile ─────────────────────────────────────────────────────────────
  async getProfile(customerId: string) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) throw new NotFoundException('Không tìm thấy thông tin khách hàng.');

    // Tính và cập nhật hạng thành viên theo điểm hiện tại
    const currentMembership = this.calculateMembership(customer.points);

    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      avatar_text: customer.avatar_text,
      member_card_id: customer.member_card_id,
      points: customer.points,
      membership: currentMembership,
      last_purchase: customer.last_purchase,
      created_at: customer.created_at,
      recent_orders: customer.orders,
    };
  }

  // ─── Cập nhật Profile ─────────────────────────────────────────────────────────
  async updateProfile(customerId: string, data: { name?: string; email?: string }) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) throw new NotFoundException('Không tìm thấy thông tin khách hàng.');
    return this.customerRepository.update(customerId, data);
  }
}
