import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { GetVouchersQueryDto } from './dto/get-vouchers-query.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VouchersRepository } from './vouchers.repository';

@Injectable()
export class VouchersService {
  constructor(private readonly vouchersRepository: VouchersRepository) {}

  async findActive(query: GetVouchersQueryDto) {
    return this.paginate(query, true);
  }

  async findAll(query: GetVouchersQueryDto) {
    return this.paginate(query, false);
  }

  async findOne(id: string) {
    const voucher = await this.vouchersRepository.findById(id);
    if (!voucher) {
      throw new NotFoundException('Không tìm thấy voucher.');
    }
    return voucher;
  }

  async findByCode(code: string) {
    const voucher = await this.vouchersRepository.findByCode(code);
    if (!voucher) {
      throw new NotFoundException('Không tìm thấy voucher.');
    }
    return voucher;
  }

  create(dto: CreateVoucherDto, adminId?: string) {
    return this.vouchersRepository.create(dto, adminId);
  }

  async update(id: string, dto: UpdateVoucherDto, adminId?: string) {
    await this.findOne(id);
    return this.vouchersRepository.update(id, dto, adminId);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.vouchersRepository.delete(id);
    return { message: 'Đã xóa voucher thành công.' };
  }

  private async paginate(query: GetVouchersQueryDto, activeOnly: boolean) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const result = await this.vouchersRepository.findAll({
      discount_type: query.discount_type,
      category: query.category,
      is_active: query.is_active,
      search: query.search,
      page,
      limit,
      activeOnly,
    });

    return {
      data: result.items,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
