import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProductCategory, ProductStatus } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

interface FindAllProductsParams {
  category?: ProductCategory;
  status?: ProductStatus;
  tag?: string;
  search?: string;
  page: number;
  limit: number;
}

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: FindAllProductsParams) {
    const { category, status, tag, search, page, limit } = params;

    const where: Prisma.ProductWhereInput = {
      ...(category ? { category } : {}),
      ...(status ? { status } : {}),
      ...(tag
        ? {
            tags: {
              some: {
                name: { equals: tag, mode: 'insensitive' },
              },
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { subname: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { details: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { tags: { orderBy: { name: 'asc' } } },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { tags: { orderBy: { name: 'asc' } } },
    });
  }

  create(data: CreateProductDto, adminId?: string) {
    const { tags, ...productData } = data;

    return this.prisma.product.create({
      data: {
        ...productData,
        created_by_admin_id: adminId,
        updated_by_admin_id: adminId,
        tags: tags?.length
          ? {
              create: tags.map((name) => ({
                name,
                created_by_admin_id: adminId,
                updated_by_admin_id: adminId,
              })),
            }
          : undefined,
      },
      include: { tags: { orderBy: { name: 'asc' } } },
    });
  }

  update(id: string, data: UpdateProductDto, adminId?: string) {
    const { tags, ...productData } = data;
    void tags;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        updated_by_admin_id: adminId,
      },
      include: { tags: { orderBy: { name: 'asc' } } },
    });
  }

  delete(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  createTag(productId: string, name: string, adminId?: string) {
    return this.prisma.productTag.create({
      data: {
        product_id: productId,
        name,
        created_by_admin_id: adminId,
        updated_by_admin_id: adminId,
      },
    });
  }

  updateTag(tagId: string, name: string, adminId?: string) {
    return this.prisma.productTag.update({
      where: { id: tagId },
      data: {
        name,
        updated_by_admin_id: adminId,
      },
    });
  }

  deleteTag(tagId: string) {
    return this.prisma.productTag.delete({
      where: { id: tagId },
    });
  }
}
