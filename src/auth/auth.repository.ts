import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCustomerByZaloId(zaloId: string) {
    return this.prisma.customer.findUnique({
      where: { zalo_id: zaloId },
    });
  }

  createCustomer(data: {
    zalo_id: string;
    name: string;
    phone?: string;
    avatar_text?: string;
  }) {
    return this.prisma.customer.create({ data });
  }

  findAdminByUsername(username: string) {
    return this.prisma.adminUser.findUnique({
      where: { username },
    });
  }
}
