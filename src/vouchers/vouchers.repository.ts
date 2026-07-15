import { Injectable } from '@nestjs/common';
import { DiscountType, Prisma, ProductCategory, Voucher } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VoucherStatus } from './voucher-status.enum';

export type VoucherSortField =
  'created_at' | 'updated_at' | 'starts_at' | 'ends_at' | 'used_count' | 'code';

export interface FindAllVouchersParams {
  discount_type?: DiscountType;
  category?: ProductCategory;
  is_active?: boolean;
  status?: VoucherStatus;
  search?: string;
  starts_from?: Date;
  starts_to?: Date;
  ends_from?: Date;
  ends_to?: Date;
  sort_by: VoucherSortField;
  sort_order: 'asc' | 'desc';
  page: number;
  limit: number;
  activeOnly?: boolean;
}

@Injectable()
export class VouchersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: FindAllVouchersParams) {
    const where = this.buildWhere(params);
    const skip = (params.page - 1) * params.limit;
    const orderBy = {
      [params.sort_by]: params.sort_order,
    } as Prisma.VoucherOrderByWithRelationInput;

    const [items, total] = await Promise.all([
      this.prisma.voucher.findMany({
        where,
        orderBy,
        skip,
        take: params.limit,
      }),
      this.prisma.voucher.count({ where }),
    ]);

    return { items, total };
  }

  async getSummary(params: FindAllVouchersParams) {
    // Summary follows search/category/date filters, but remains a status overview.
    const baseParams = {
      ...params,
      status: undefined,
      is_active: undefined,
      activeOnly: false,
    };
    const baseWhere = this.buildBaseWhere(baseParams);
    const withStatus = (status: VoucherStatus): Prisma.VoucherWhereInput => ({
      AND: [baseWhere, this.buildStatusWhere(status)],
    });

    const [total, running, scheduled, paused, expired, exhausted, totalUsed] =
      await Promise.all([
        this.prisma.voucher.count({ where: baseWhere }),
        this.prisma.voucher.count({ where: withStatus(VoucherStatus.RUNNING) }),
        this.prisma.voucher.count({
          where: withStatus(VoucherStatus.SCHEDULED),
        }),
        this.prisma.voucher.count({ where: withStatus(VoucherStatus.PAUSED) }),
        this.prisma.voucher.count({ where: withStatus(VoucherStatus.EXPIRED) }),
        this.prisma.voucher.count({
          where: withStatus(VoucherStatus.EXHAUSTED),
        }),
        this.prisma.voucher.aggregate({
          where: baseWhere,
          _sum: { used_count: true },
        }),
      ]);

    return {
      total,
      running,
      scheduled,
      paused,
      expired,
      exhausted,
      totalUsedCount: totalUsed._sum.used_count ?? 0,
    };
  }

  findById(id: string) {
    return this.prisma.voucher.findUnique({ where: { id } });
  }

  findByCode(code: string) {
    return this.prisma.voucher.findUnique({
      where: { code: code.trim().toUpperCase() },
    });
  }

  create(data: CreateVoucherDto, adminId?: string) {
    return this.prisma.voucher.create({
      data: {
        ...data,
        code: data.code.trim().toUpperCase(),
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
        ...(data.code ? { code: data.code.trim().toUpperCase() } : {}),
        updated_by_admin_id: adminId,
      },
    });
  }

  delete(id: string) {
    return this.prisma.voucher.delete({ where: { id } });
  }

  private buildWhere(params: FindAllVouchersParams) {
    const conditions: Prisma.VoucherWhereInput[] = [
      this.buildBaseWhere(params),
    ];

    if (params.activeOnly) {
      conditions.push(this.buildStatusWhere(VoucherStatus.RUNNING));
    } else if (params.status) {
      conditions.push(this.buildStatusWhere(params.status));
    }

    return { AND: conditions } satisfies Prisma.VoucherWhereInput;
  }

  private buildBaseWhere(
    params: FindAllVouchersParams,
  ): Prisma.VoucherWhereInput {
    const conditions: Prisma.VoucherWhereInput[] = [];

    if (params.discount_type) {
      conditions.push({ discount_type: params.discount_type });
    }
    if (params.category) {
      conditions.push({ applicable_categories: { has: params.category } });
    }
    if (typeof params.is_active === 'boolean') {
      conditions.push({ is_active: params.is_active });
    }
    if (params.search) {
      conditions.push({
        OR: [
          { code: { contains: params.search, mode: 'insensitive' } },
          { title: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } },
        ],
      });
    }
    if (params.starts_from || params.starts_to) {
      conditions.push({
        starts_at: {
          ...(params.starts_from ? { gte: params.starts_from } : {}),
          ...(params.starts_to ? { lte: params.starts_to } : {}),
        },
      });
    }
    if (params.ends_from || params.ends_to) {
      conditions.push({
        ends_at: {
          ...(params.ends_from ? { gte: params.ends_from } : {}),
          ...(params.ends_to ? { lte: params.ends_to } : {}),
        },
      });
    }

    return conditions.length ? { AND: conditions } : {};
  }

  private buildStatusWhere(status: VoucherStatus): Prisma.VoucherWhereInput {
    const now = new Date();
    const started: Prisma.VoucherWhereInput = {
      OR: [{ starts_at: null }, { starts_at: { lte: now } }],
    };
    const notEnded: Prisma.VoucherWhereInput = {
      OR: [{ ends_at: null }, { ends_at: { gte: now } }],
    };
    const hasEnded: Prisma.VoucherWhereInput = { ends_at: { lt: now } };
    const exhausted: Prisma.VoucherWhereInput = {
      usage_limit: { not: null },
      used_count: { gte: this.prisma.voucher.fields.usage_limit },
    };
    const hasUsage: Prisma.VoucherWhereInput = {
      OR: [
        { usage_limit: null },
        { used_count: { lt: this.prisma.voucher.fields.usage_limit } },
      ],
    };

    switch (status) {
      case VoucherStatus.PAUSED:
        return { is_active: false };
      case VoucherStatus.SCHEDULED:
        return { is_active: true, starts_at: { gt: now } };
      case VoucherStatus.EXPIRED:
        return { AND: [{ is_active: true }, started, hasEnded] };
      case VoucherStatus.EXHAUSTED:
        return { AND: [{ is_active: true }, started, notEnded, exhausted] };
      case VoucherStatus.RUNNING:
        return { AND: [{ is_active: true }, started, notEnded, hasUsage] };
    }
  }
}

export function getVoucherStatus(voucher: Voucher): VoucherStatus {
  const now = Date.now();
  if (!voucher.is_active) return VoucherStatus.PAUSED;
  if (voucher.starts_at && voucher.starts_at.getTime() > now) {
    return VoucherStatus.SCHEDULED;
  }
  if (voucher.ends_at && voucher.ends_at.getTime() < now) {
    return VoucherStatus.EXPIRED;
  }
  if (
    voucher.usage_limit !== null &&
    voucher.used_count >= voucher.usage_limit
  ) {
    return VoucherStatus.EXHAUSTED;
  }
  return VoucherStatus.RUNNING;
}
