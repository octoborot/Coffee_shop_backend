import { Injectable } from '@nestjs/common';
import { DiscountType, Prisma, ProductCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

interface FindAllVouchersParams {
  discount_type?: DiscountType;
  category?: ProductCategory;
  is_active?: boolean;
  search?: string;
  page: number;
  limit: number;
  activeOnly?: boolean;
}

@Injectable()
export class VouchersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: FindAllVouchersParams) {
    const {
      discount_type,
      category,
      is_active,
      search,
      page,
      limit,
      activeOnly,
    } = params;
    const now = new Date();
    const where: Prisma.VoucherWhereInput = {
      ...(discount_type ? { discount_type } : {}),
      ...(category ? { applicable_categories: { has: category } } : {}),
      ...(typeof is_active === 'boolean' ? { is_active } : {}),
      ...(activeOnly
        ? {
            is_active: true,
            OR: [{ starts_at: null }, { starts_at: { lte: now } }],
            AND: [{ OR: [{ ends_at: null }, { ends_at: { gte: now } }] }],
          }
        : {}),
      ...(search
        ? {
            OR: [
              { code: { contains: search, mode: 'insensitive' } },
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.voucher.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.voucher.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string) {
    return this.prisma.voucher.findUnique({ where: { id } });
  }

  findByCode(code: string) {
    return this.prisma.voucher.findUnique({ where: { code } });
  }

  create(data: CreateVoucherDto, adminId?: string) {
    return this.prisma.voucher.create({
      data: {
        ...data,
        applicable_categories: data.applicable_categories ?? [],
        created_by_admin_id: adminId,
        updated_by_admin_id: adminId,
      },
    });
  }

  update(id: string, data: UpdateVoucherDto, adminId?: string) {
    return this.prisma.voucher.update({
      where: { id },
      data: {
        ...data,
        updated_by_admin_id: adminId,
      },
    });
  }

  delete(id: string) {
    return this.prisma.voucher.delete({ where: { id } });
  }
}
