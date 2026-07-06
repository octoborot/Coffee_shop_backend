import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ZaloLoginDto } from './dto/zalo-login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('zalo-login')
  @ApiOperation({ summary: 'Đăng nhập qua Zalo Mini App (Customer)' })
  @ApiResponse({ status: 201, description: 'Trả về JWT token và thông tin Customer' })
  zaloLogin(@Body() dto: ZaloLoginDto) {
    return this.authService.zaloLogin(dto.code);
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Đăng nhập Admin bằng username/password' })
  @ApiResponse({ status: 201, description: 'Trả về JWT token và thông tin Admin' })
  @ApiResponse({ status: 401, description: 'Sai tài khoản hoặc mật khẩu' })
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto.username, dto.password);
  }
}
