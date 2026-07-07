import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        addresses: {
          orderBy: { created_at: 'desc' },
        },
        orders: {
          orderBy: { created_at: 'desc' },
          take: 5,
          include: { items: true },
        },
      },
    });
  }

  update(id: string, data: { name?: string; email?: string }) {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  // ─── Customer Address Methods ─────────────────────────────────────────────

  async createAddress(
    customerId: string,
    data: {
      label?: string;
      receiver: string;
      phone: string;
      address: string;
      is_default?: boolean;
    },
  ) {
    if (data.is_default) {
      await this.prisma.customerAddress.updateMany({
        where: { customer_id: customerId },
        data: { is_default: false },
      });
    }
    return this.prisma.customerAddress.create({
      data: {
        ...data,
        customer_id: customerId,
      },
    });
  }

  getAddresses(customerId: string) {
    return this.prisma.customerAddress.findMany({
      where: { customer_id: customerId },
      orderBy: { created_at: 'desc' },
    });
  }

  getAddressById(addressId: string) {
    return this.prisma.customerAddress.findUnique({
      where: { id: addressId },
    });
  }

  async updateAddress(
    customerId: string,
    addressId: string,
    data: {
      label?: string;
      receiver?: string;
      phone?: string;
      address?: string;
      is_default?: boolean;
    },
  ) {
    if (data.is_default) {
      await this.prisma.customerAddress.updateMany({
        where: { customer_id: customerId },
        data: { is_default: false },
      });
    }
    return this.prisma.customerAddress.update({
      where: { id: addressId },
      data,
    });
  }

  deleteAddress(addressId: string) {
    return this.prisma.customerAddress.delete({
      where: { id: addressId },
    });
  }
}
