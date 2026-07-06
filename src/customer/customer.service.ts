import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  // ─── Lấy Profile ─────────────────────────────────────────────────────────────
  async getProfile(customerId: string) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer)
      throw new NotFoundException('Không tìm thấy thông tin khách hàng.');

    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      avatar_text: customer.avatar_text,
      created_at: customer.created_at,
      recent_orders: customer.orders,
    };
  }

  // ─── Cập nhật Profile ─────────────────────────────────────────────────────────
  async updateProfile(
    customerId: string,
    data: { name?: string; email?: string },
  ) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer)
      throw new NotFoundException('Không tìm thấy thông tin khách hàng.');
    return this.customerRepository.update(customerId, data);
  }
}
