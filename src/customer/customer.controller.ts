import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCustomerAddressDto, UpdateCustomerAddressDto } from './dto/customer-address.dto';

class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;
}

@ApiTags('Customer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Lấy thông tin hồ sơ cá nhân (bao gồm địa chỉ và đơn hàng)',
  })
  getProfile(@Request() req) {
    return this.customerService.getProfile(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân (tên, email)' })
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.customerService.updateProfile(req.user.id, dto);
  }

  // ─── Địa chỉ (Addresses) ─────────────────────────────────────────────────────

  @Get('addresses')
  @ApiOperation({ summary: 'Lấy danh sách sổ địa chỉ của khách hàng' })
  getAddresses(@Request() req) {
    return this.customerService.getAddresses(req.user.id);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Thêm địa chỉ mới' })
  createAddress(@Request() req, @Body() dto: CreateCustomerAddressDto) {
    return this.customerService.createAddress(req.user.id, dto);
  }

  @Patch('addresses/:id')
  @ApiOperation({ summary: 'Cập nhật địa chỉ' })
  updateAddress(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerAddressDto,
  ) {
    return this.customerService.updateAddress(req.user.id, id, dto);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Xóa địa chỉ' })
  deleteAddress(@Request() req, @Param('id') id: string) {
    return this.customerService.deleteAddress(req.user.id, id);
  }
}
