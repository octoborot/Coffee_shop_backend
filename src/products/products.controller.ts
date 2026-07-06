import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductCategory, ProductStatus } from '@prisma/client';

@ApiTags('Products')
@Controller('api/v1/products') // Đổi đường dẫn cho đồng bộ với API khác
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả sản phẩm' })
  @ApiQuery({ name: 'category', enum: ProductCategory, required: false })
  @ApiQuery({ name: 'status', enum: ProductStatus, required: false })
  findAll(
    @Query('category') category?: ProductCategory,
    @Query('status') status?: ProductStatus,
  ) {
    return this.productsService.findAll({ category, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một sản phẩm' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
