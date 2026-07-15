import { NotFoundException } from '@nestjs/common';
import { Prisma, ProductCategory, ProductStatus } from '@prisma/client';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';
import { CloudinaryService } from '../media/cloudinary.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: jest.Mocked<ProductsRepository>;
  let cloudinaryService: jest.Mocked<CloudinaryService>;

  const product = {
    id: 'product-1',
    created_by_admin_id: 'admin-1',
    updated_by_admin_id: 'admin-1',
    name: 'Caramel Macchiato',
    subname: 'Caramel Macchiato Đá',
    category: ProductCategory.Coffee,
    price: new Prisma.Decimal(1.8),
    price_vnd: 45000,
    rating: new Prisma.Decimal(4.8),
    image: 'https://example.com/caramel.jpg',
    image_public_id: 'coffee-shop/products/caramel',
    status: ProductStatus.Available,
    details: 'Size M',
    description: 'Coffee with caramel.',
    created_at: new Date('2026-07-07T10:00:00.000Z'),
    updated_at: new Date('2026-07-07T10:00:00.000Z'),
    tags: [{ name: 'Best Seller' }, { name: 'Bán Chạy' }],
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findTags: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createTag: jest.fn(),
      updateTag: jest.fn(),
      deleteTag: jest.fn(),
    } as unknown as jest.Mocked<ProductsRepository>;

    cloudinaryService = {
      deleteProductImage: jest.fn(),
    } as unknown as jest.Mocked<CloudinaryService>;
    service = new ProductsService(repository, cloudinaryService);
  });

  it('returns paginated product cards', async () => {
    repository.findAll.mockResolvedValue({ items: [product], total: 1 } as any);

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(repository.findAll).toHaveBeenCalledWith({
      category: undefined,
      status: undefined,
      tag: undefined,
      search: undefined,
      page: 1,
      limit: 10,
    });
    expect(result).toEqual({
      data: [
        {
          id: 'product-1',
          name: 'Caramel Macchiato',
          subname: 'Caramel Macchiato Đá',
          category: ProductCategory.Coffee,
          price: 1.8,
          priceVnd: 45000,
          rating: 4.8,
           image: 'https://example.com/caramel.jpg',
           image_public_id: 'coffee-shop/products/caramel',
          status: ProductStatus.Available,
          details: 'Size M',
          description: 'Coffee with caramel.',
          tags: ['Best Seller', 'Bán Chạy'],
        },
      ],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
  });

  it('returns one product card', async () => {
    repository.findById.mockResolvedValue(product as any);

    const result = await service.findOne('product-1');

    expect(repository.findById).toHaveBeenCalledWith('product-1');
    expect(result.tags).toEqual(['Best Seller', 'Bán Chạy']);
    expect(result.priceVnd).toBe(45000);
  });

  it('returns product tags for filtering', async () => {
    repository.findTags.mockResolvedValue(['Bán Chạy', 'Món Mới']);

    await expect(service.findTags()).resolves.toEqual(['Bán Chạy', 'Món Mới']);
  });

  it('throws NotFoundException when product does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates a product and formats response', async () => {
    repository.create.mockResolvedValue(product as any);

    const result = await service.create(
      {
        name: 'Caramel Macchiato',
        category: ProductCategory.Coffee,
        price: 1.8,
        price_vnd: 45000,
      },
      'admin-1',
    );

    expect(repository.create).toHaveBeenCalledWith(
      {
        name: 'Caramel Macchiato',
        category: ProductCategory.Coffee,
        price: 1.8,
        price_vnd: 45000,
      },
      'admin-1',
    );
    expect(result.id).toBe('product-1');
  });

  it('updates a product after existence check', async () => {
    repository.findById.mockResolvedValue(product as any);
    repository.update.mockResolvedValue({
      ...product,
      price_vnd: 49000,
    } as any);

    const result = await service.update(
      'product-1',
      { price_vnd: 49000 },
      'admin-1',
    );

    expect(repository.findById).toHaveBeenCalledWith('product-1');
    expect(repository.update).toHaveBeenCalledWith(
      'product-1',
      { price_vnd: 49000 },
      'admin-1',
    );
    expect(result.priceVnd).toBe(49000);
  });

  it('removes a product after existence check', async () => {
    repository.findById.mockResolvedValue(product as any);
    repository.delete.mockResolvedValue(product);

    await expect(service.remove('product-1')).resolves.toEqual({
      message: 'Đã xóa sản phẩm thành công.',
    });
    expect(repository.delete).toHaveBeenCalledWith('product-1');
    expect(cloudinaryService.deleteProductImage).toHaveBeenCalledWith(
      'coffee-shop/products/caramel',
    );
  });

  it('deletes the previous Cloudinary image after replacing it', async () => {
    repository.findById.mockResolvedValue(product as any);
    repository.update.mockResolvedValue({
      ...product,
      image: 'https://example.com/new.jpg',
      image_public_id: 'coffee-shop/products/new',
    } as any);

    await service.update(
      'product-1',
      {
        image: 'https://example.com/new.jpg',
        image_public_id: 'coffee-shop/products/new',
      },
      'admin-1',
    );

    expect(cloudinaryService.deleteProductImage).toHaveBeenCalledWith(
      'coffee-shop/products/caramel',
    );
  });

  it('creates product tag after product exists', async () => {
    repository.findById.mockResolvedValue(product as any);
    repository.createTag.mockResolvedValue({ id: 'tag-1', name: 'New' } as any);

    const result = await service.createTag(
      'product-1',
      { name: 'New' },
      'admin-1',
    );

    expect(repository.createTag).toHaveBeenCalledWith(
      'product-1',
      'New',
      'admin-1',
    );
    expect(result).toEqual({ id: 'tag-1', name: 'New' });
  });

  it('updates product tag when name is provided', async () => {
    repository.updateTag.mockResolvedValue({
      id: 'tag-1',
      name: 'Updated',
    } as any);

    const result = await service.updateTag(
      'tag-1',
      { name: 'Updated' },
      'admin-1',
    );

    expect(repository.updateTag).toHaveBeenCalledWith(
      'tag-1',
      'Updated',
      'admin-1',
    );
    expect(result).toEqual({ id: 'tag-1', name: 'Updated' });
  });

  it('does not update product tag when dto is empty', async () => {
    const result = await service.updateTag('tag-1', {}, 'admin-1');

    expect(repository.updateTag).not.toHaveBeenCalled();
    expect(result).toEqual({ message: 'Không có dữ liệu cần cập nhật.' });
  });
});
