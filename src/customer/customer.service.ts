import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { CreateCustomerAddressDto, UpdateCustomerAddressDto } from './dto/customer-address.dto';

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
      addresses: customer.addresses,
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

  // ─── Quản lý sổ địa chỉ ────────────────────────────────────────────────────────
  getAddresses(customerId: string) {
    return this.customerRepository.getAddresses(customerId);
  }

  createAddress(customerId: string, dto: CreateCustomerAddressDto) {
    return this.customerRepository.createAddress(customerId, dto);
  }

  async updateAddress(
    customerId: string,
    addressId: string,
    dto: UpdateCustomerAddressDto,
  ) {
    const address = await this.customerRepository.getAddressById(addressId);
    if (!address) throw new NotFoundException('Không tìm thấy địa chỉ.');
    if (address.customer_id !== customerId)
      throw new ForbiddenException('Bạn không có quyền sửa địa chỉ này.');
    return this.customerRepository.updateAddress(customerId, addressId, dto);
  }

  async deleteAddress(customerId: string, addressId: string) {
    const address = await this.customerRepository.getAddressById(addressId);
    if (!address) throw new NotFoundException('Không tìm thấy địa chỉ.');
    if (address.customer_id !== customerId)
      throw new ForbiddenException('Bạn không có quyền xoá địa chỉ này.');
    return this.customerRepository.deleteAddress(addressId);
  }
}
