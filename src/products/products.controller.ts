import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductTagDto } from './dto/create-product-tag.dto';
import { UpdateProductTagDto } from './dto/update-product-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from '../media/cloudinary.service';
import { DeleteProductImageDto } from './dto/delete-product-image.dto';

type AuthenticatedRequest = {
  user: {
    id: string;
  };
};
@ApiTags('Products')
@Controller('api/v1/products') // Đổi đường dẫn cho đồng bộ với API khác
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm cho Mini App ProductCard' })
  findAll(@Query() query: GetProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Lấy danh sách tag sản phẩm để lọc' })
  findTags() {
    return this.productsService.findTags();
  }

  @Post('images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        callback(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype));
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Tải ảnh sản phẩm lên Cloudinary (Admin)' })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.cloudinaryService.uploadProductImage(file);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  }

  @Delete('images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa ảnh sản phẩm tạm trên Cloudinary (Admin)' })
  async deleteImage(@Body() dto: DeleteProductImageDto) {
    await this.cloudinaryService.deleteProductImage(dto.public_id);
    return { message: 'Đã xóa ảnh sản phẩm.' };
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
  create(@Body() dto: CreateProductDto, @Request() req: AuthenticatedRequest) {
    return this.productsService.create(dto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật sản phẩm (Admin)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Request() req: AuthenticatedRequest,
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
    @Request() req: AuthenticatedRequest,
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
    @Request() req: AuthenticatedRequest,
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
