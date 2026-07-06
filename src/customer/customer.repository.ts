import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
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
}
