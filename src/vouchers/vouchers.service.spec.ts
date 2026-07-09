import { NotFoundException } from '@nestjs/common';
import { DiscountType, ProductCategory } from '@prisma/client';
import { VouchersRepository } from './vouchers.repository';
import { VouchersService } from './vouchers.service';

describe('VouchersService', () => {
  let service: VouchersService;
  let repository: jest.Mocked<VouchersRepository>;

  const voucher = {
    id: 'voucher-1',
    code: 'HOTDEAL',
    title: 'Mua 1 tặng 1',
    description: 'Áp dụng cho Coffee và Tea.',
    image: null,
    discount_type: DiscountType.BUY_ONE_GET_ONE,
    discount_value: 0,
    min_order_vnd: 0,
    max_discount_vnd: 50000,
    applicable_categories: [ProductCategory.Coffee, ProductCategory.Tea],
    starts_at: null,
    ends_at: null,
    usage_limit: 100,
    used_count: 0,
    is_active: true,
    created_by_admin_id: 'admin-1',
    updated_by_admin_id: 'admin-1',
    created_at: new Date('2026-07-07T10:00:00.000Z'),
    updated_at: new Date('2026-07-07T10:00:00.000Z'),
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCode: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<VouchersRepository>;

    service = new VouchersService(repository);
  });

  it('returns active vouchers with pagination', async () => {
    repository.findAll.mockResolvedValue({ items: [voucher], total: 1 });

    const result = await service.findActive({ page: 1, limit: 10 });

    expect(repository.findAll).toHaveBeenCalledWith({
      discount_type: undefined,
      category: undefined,
      is_active: undefined,
      search: undefined,
      page: 1,
      limit: 10,
      activeOnly: true,
    });
    expect(result.meta).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
    expect(result.data).toEqual([voucher]);
  });

  it('returns all vouchers for admin with pagination', async () => {
    repository.findAll.mockResolvedValue({ items: [voucher], total: 1 });

    const result = await service.findAll({ search: 'HOT', page: 2, limit: 5 });

    expect(repository.findAll).toHaveBeenCalledWith({
      discount_type: undefined,
      category: undefined,
      is_active: undefined,
      search: 'HOT',
      page: 2,
      limit: 5,
      activeOnly: false,
    });
    expect(result.meta.totalPages).toBe(1);
  });

  it('returns one voucher by id', async () => {
    repository.findById.mockResolvedValue(voucher);

    await expect(service.findOne('voucher-1')).resolves.toEqual(voucher);
  });

  it('throws NotFoundException when voucher id does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('returns voucher by code', async () => {
    repository.findByCode.mockResolvedValue(voucher);

    await expect(service.findByCode('HOTDEAL')).resolves.toEqual(voucher);
  });

  it('throws NotFoundException when voucher code does not exist', async () => {
    repository.findByCode.mockResolvedValue(null);

    await expect(service.findByCode('NOPE')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates voucher', async () => {
    repository.create.mockResolvedValue(voucher);

    const dto = {
      code: 'HOTDEAL',
      title: 'Mua 1 tặng 1',
      discount_type: DiscountType.BUY_ONE_GET_ONE,
      discount_value: 0,
    };

    await expect(service.create(dto, 'admin-1')).resolves.toEqual(voucher);
    expect(repository.create).toHaveBeenCalledWith(dto, 'admin-1');
  });

  it('updates voucher after existence check', async () => {
    repository.findById.mockResolvedValue(voucher);
    repository.update.mockResolvedValue({
      ...voucher,
      title: 'Updated',
    });

    const result = await service.update(
      'voucher-1',
      { title: 'Updated' },
      'admin-1',
    );

    expect(repository.update).toHaveBeenCalledWith(
      'voucher-1',
      { title: 'Updated' },
      'admin-1',
    );
    expect(result.title).toBe('Updated');
  });

  it('removes voucher after existence check', async () => {
    repository.findById.mockResolvedValue(voucher);
    repository.delete.mockResolvedValue(voucher);

    await expect(service.remove('voucher-1')).resolves.toEqual({
      message: 'Đã xóa voucher thành công.',
    });
    expect(repository.delete).toHaveBeenCalledWith('voucher-1');
  });
});
