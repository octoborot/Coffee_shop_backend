import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductCategory, ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filters?: { category?: ProductCategory; status?: ProductStatus }) {
    return this.prisma.product.findMany({
      where: filters,
      orderBy: { created_at: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }
}
