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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { GetVouchersQueryDto } from './dto/get-vouchers-query.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VouchersService } from './vouchers.service';

@ApiTags('Vouchers')
@Controller('api/v1')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

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
  create(@Body() dto: CreateVoucherDto, @Request() req) {
    return this.vouchersService.create(dto, req.user.id);
  }

  @Patch('admin/vouchers/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật voucher (Admin)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVoucherDto,
    @Request() req,
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
