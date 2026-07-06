import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
  @ApiOperation({ summary: 'Lấy thông tin hồ sơ cá nhân, hạng thành viên, điểm tích lũy' })
  getProfile(@Request() req) {
    return this.customerService.getProfile(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân (tên, email)' })
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.customerService.updateProfile(req.user.id, dto);
  }
}
