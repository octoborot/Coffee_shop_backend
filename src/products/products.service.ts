import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from '@prisma/client';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductTagDto } from './dto/create-product-tag.dto';
import { UpdateProductTagDto } from './dto/update-product-tag.dto';
import { CloudinaryService } from '../media/cloudinary.service';

type ProductWithTags = Product & {
  tags: { name: string }[];
};

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private toProductCard(product: ProductWithTags) {
    return {
      id: product.id,
      name: product.name,
      subname: product.subname,
      category: product.category,
      price: Number(product.price),
      priceVnd: product.price_vnd,
      rating: product.rating ? Number(product.rating) : null,
      image: product.image,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      image_public_id: product.image_public_id,
      status: product.status,
      details: product.details,
      description: product.description,
      tags: product.tags.map((tag) => tag.name),
    };
  }

  async findAll(query: GetProductsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const result = await this.productsRepository.findAll({
      category: query.category,
      status: query.status,
      tag: query.tag,
      search: query.search,
      page,
      limit,
    });

    return {
      data: result.items.map((product) => this.toProductCard(product)),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }

  findTags() {
    return this.productsRepository.findTags();
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Sản phẩm với ID ${id} không tồn tại`);
    }
    return this.toProductCard(product);
  }

  async create(dto: CreateProductDto, adminId?: string) {
    const product = await this.productsRepository.create(dto, adminId);
    return this.toProductCard(product);
  }

  async update(id: string, dto: UpdateProductDto, adminId?: string) {
    const current = await this.ensureProductExists(id);
    const product = await this.productsRepository.update(id, dto, adminId);
    if (
      current.image_public_id &&
      dto.image_public_id !== undefined &&
      dto.image_public_id !== current.image_public_id
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.deleteImageWithoutFailingRequest(current.image_public_id);
    }
    return this.toProductCard(product);
  }

  async remove(id: string) {
    const product = await this.ensureProductExists(id);
    await this.productsRepository.delete(id);
    if (product.image_public_id) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.deleteImageWithoutFailingRequest(product.image_public_id);
    }
    return { message: 'Đã xóa sản phẩm thành công.' };
  }

  async createTag(
    productId: string,
    dto: CreateProductTagDto,
    adminId?: string,
  ) {
    await this.ensureProductExists(productId);
    return this.productsRepository.createTag(productId, dto.name, adminId);
  }

  async updateTag(tagId: string, dto: UpdateProductTagDto, adminId?: string) {
    if (!dto.name) {
      return { message: 'Không có dữ liệu cần cập nhật.' };
    }
    return this.productsRepository.updateTag(tagId, dto.name, adminId);
  }

  async removeTag(tagId: string) {
    await this.productsRepository.deleteTag(tagId);
    return { message: 'Đã xóa tag sản phẩm thành công.' };
  }

  private async ensureProductExists(id: string) {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Sản phẩm với ID ${id} không tồn tại`);
    }
    return product;
  }

  private async deleteImageWithoutFailingRequest(publicId: string) {
    try {
      await this.cloudinaryService.deleteProductImage(publicId);
    } catch (error) {
      this.logger.error(`Không thể xóa ảnh Cloudinary ${publicId}`, error);
    }
  }
}
