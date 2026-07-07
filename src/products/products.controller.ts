import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductTagDto } from './dto/create-product-tag.dto';
import { UpdateProductTagDto } from './dto/update-product-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Products')
@Controller('api/v1/products') // Đổi đường dẫn cho đồng bộ với API khác
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm cho Mini App ProductCard' })
  findAll(@Query() query: GetProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một sản phẩm' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo sản phẩm mới (Admin)' })
  create(@Body() dto: CreateProductDto, @Request() req) {
    return this.productsService.create(dto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật sản phẩm (Admin)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Request() req,
  ) {
    return this.productsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa sản phẩm (Admin)' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/tags')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm tag cho sản phẩm (Admin)' })
  createTag(
    @Param('id') productId: string,
    @Body() dto: CreateProductTagDto,
    @Request() req,
  ) {
    return this.productsService.createTag(productId, dto, req.user.id);
  }

  @Patch(':id/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật tag sản phẩm (Admin)' })
  updateTag(
    @Param('tagId') tagId: string,
    @Body() dto: UpdateProductTagDto,
    @Request() req,
  ) {
    return this.productsService.updateTag(tagId, dto, req.user.id);
  }

  @Delete(':id/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa tag sản phẩm (Admin)' })
  removeTag(@Param('tagId') tagId: string) {
    return this.productsService.removeTag(tagId);
  }
}
