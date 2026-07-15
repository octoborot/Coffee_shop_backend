import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Voucher } from '@prisma/client';
import { CloudinaryService } from '../media/cloudinary.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { GetVouchersQueryDto } from './dto/get-vouchers-query.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import {
  FindAllVouchersParams,
  getVoucherStatus,
  VoucherSortField,
  VouchersRepository,
} from './vouchers.repository';

@Injectable()
export class VouchersService {
  private readonly logger = new Logger(VouchersService.name);

  constructor(
    private readonly vouchersRepository: VouchersRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  findActive(query: GetVouchersQueryDto) {
    return this.paginate(query, true);
  }

  findAll(query: GetVouchersQueryDto) {
    return this.paginate(query, false);
  }

  async findOne(id: string) {
    const voucher = await this.vouchersRepository.findById(id);
    if (!voucher) throw new NotFoundException('Không tìm thấy voucher.');
    return this.mapVoucher(voucher);
  }

  async findByCode(code: string) {
    const voucher = await this.vouchersRepository.findByCode(code);
    if (!voucher) throw new NotFoundException('Không tìm thấy voucher.');
    return this.mapVoucher(voucher);
  }

  async create(dto: CreateVoucherDto, adminId?: string) {
    const voucher = await this.vouchersRepository.create(dto, adminId);
    return this.mapVoucher(voucher);
  }

  async update(id: string, dto: UpdateVoucherDto, adminId?: string) {
    const current = await this.vouchersRepository.findById(id);
    if (!current) throw new NotFoundException('Không tìm thấy voucher.');

    const voucher = await this.vouchersRepository.update(id, dto, adminId);
    if (
      current.image_public_id &&
      dto.image_public_id !== undefined &&
      dto.image_public_id !== current.image_public_id
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.deleteImageWithoutFailingRequest(current.image_public_id);
    }
    return this.mapVoucher(voucher);
  }

  async updateStatus(id: string, isActive: boolean, adminId?: string) {
    const current = await this.vouchersRepository.findById(id);
    if (!current) throw new NotFoundException('Không tìm thấy voucher.');
    const voucher = await this.vouchersRepository.update(
      id,
      { is_active: isActive },
      adminId,
    );
    return this.mapVoucher(voucher);
  }

  async remove(id: string) {
    const voucher = await this.vouchersRepository.findById(id);
    if (!voucher) throw new NotFoundException('Không tìm thấy voucher.');
    await this.vouchersRepository.delete(id);
    if (voucher.image_public_id) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.deleteImageWithoutFailingRequest(voucher.image_public_id);
    }
    return { message: 'Đã xóa voucher thành công.' };
  }

  private async paginate(query: GetVouchersQueryDto, activeOnly: boolean) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const params: FindAllVouchersParams = {
      discount_type: query.discount_type,
      category: query.category,
      is_active: query.is_active,
      status: query.status,
      search: query.search || undefined,
      starts_from: query.starts_from ? new Date(query.starts_from) : undefined,
      starts_to: query.starts_to ? new Date(query.starts_to) : undefined,
      ends_from: query.ends_from ? new Date(query.ends_from) : undefined,
      ends_to: query.ends_to ? new Date(query.ends_to) : undefined,
      sort_by: (query.sort_by ?? 'created_at') as VoucherSortField,
      sort_order: query.sort_order ?? 'desc',
      page,
      limit,
      activeOnly,
    };
    const [result, summary] = await Promise.all([
      this.vouchersRepository.findAll(params),
      this.vouchersRepository.getSummary(params),
    ]);

    return {
      data: result.items.map((voucher) => this.mapVoucher(voucher)),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
      summary,
    };
  }

  private mapVoucher(voucher: Voucher) {
    return { ...voucher, status: getVoucherStatus(voucher) };
  }

  private async deleteImageWithoutFailingRequest(publicId: string) {
    try {
      await this.cloudinaryService.deleteVoucherImage(publicId);
    } catch (error) {
      this.logger.error(`Không thể xóa ảnh Cloudinary ${publicId}`, error);
    }
  }
}
