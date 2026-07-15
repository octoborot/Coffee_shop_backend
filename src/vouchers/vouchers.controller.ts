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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from '../media/cloudinary.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { DeleteVoucherImageDto } from './dto/delete-voucher-image.dto';
import { GetVouchersQueryDto } from './dto/get-vouchers-query.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { UpdateVoucherStatusDto } from './dto/update-voucher-status.dto';
import { VouchersService } from './vouchers.service';

type AuthenticatedRequest = {
  user: {
    id: string;
  };
};
@ApiTags('Vouchers')
@Controller('api/v1')
export class VouchersController {
  constructor(
    private readonly vouchersService: VouchersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('vouchers')
  @ApiOperation({
    summary: 'Lấy danh sách voucher đang hoạt động cho Mini App',
  })
  findActive(@Query() query: GetVouchersQueryDto) {
    return this.vouchersService.findActive(query);
  }

  @Get('vouchers/code/:code')
  @ApiOperation({ summary: 'Lấy voucher theo mã' })
  findByCode(@Param('code') code: string) {
    return this.vouchersService.findByCode(code);
  }

  @Get('admin/vouchers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy tất cả voucher (Admin)' })
  findAll(@Query() query: GetVouchersQueryDto) {
    return this.vouchersService.findAll(query);
  }

  @Post('admin/vouchers/images')
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
  @ApiOperation({ summary: 'Tải ảnh voucher lên Cloudinary (Admin)' })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.cloudinaryService.uploadVoucherImage(file);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  }

  @Delete('admin/vouchers/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa ảnh voucher tạm trên Cloudinary (Admin)' })
  async deleteImage(@Body() dto: DeleteVoucherImageDto) {
    await this.cloudinaryService.deleteVoucherImage(dto.public_id);
    return { message: 'Đã xóa ảnh voucher.' };
  }

  @Patch('admin/vouchers/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bật hoặc tắt voucher (Admin)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVoucherStatusDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.vouchersService.updateStatus(id, dto.is_active, req.user.id);
  }

  @Get('admin/vouchers/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chi tiết voucher (Admin)' })
  findOne(@Param('id') id: string) {
    return this.vouchersService.findOne(id);
  }

  @Post('admin/vouchers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo voucher (Admin)' })
  create(@Body() dto: CreateVoucherDto, @Request() req: AuthenticatedRequest) {
    return this.vouchersService.create(dto, req.user.id);
  }

  @Patch('admin/vouchers/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật voucher (Admin)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVoucherDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.vouchersService.update(id, dto, req.user.id);
  }

  @Delete('admin/vouchers/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa voucher (Admin)' })
  remove(@Param('id') id: string) {
    return this.vouchersService.remove(id);
  }
}
