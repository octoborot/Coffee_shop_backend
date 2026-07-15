import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ZaloLoginDto } from './dto/zalo-login.dto';
import { ZaloMiniAppLoginDto } from './dto/zalo-miniapp-login.dto';
import { ZaloPhoneDto } from './dto/zalo-phone.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('zalo-login')
  @ApiOperation({ summary: 'Đăng nhập qua Zalo Mini App (Customer)' })
  @ApiResponse({
    status: 201,
    description: 'Trả về JWT token và thông tin Customer',
  })
  zaloLogin(@Body() dto: ZaloLoginDto) {
    return this.authService.zaloLogin(dto.code);
  }

  @Post('zalo-miniapp/login')
  @ApiOperation({ summary: 'Đăng nhập qua Zalo Mini App (Bằng Access Token)' })
  @ApiResponse({
    status: 201,
    description: 'Trả về JWT token và thông tin Customer',
  })
  zaloMiniAppLogin(@Body() dto: ZaloMiniAppLoginDto) {
    return this.authService.zaloMiniAppLogin(dto.access_token);
  }

  @Post('zalo-miniapp/phone')
  @ApiOperation({ summary: 'Giải mã số điện thoại từ Zalo Mini App' })
  @ApiResponse({
    status: 201,
    description: 'Trả về số điện thoại và cập nhật vào Customer',
  })
  // Trong thực tế nên có Guard JWT ở đây để lấy customerId từ token
  // @UseGuards(CustomerJwtAuthGuard)
  // zaloMiniAppGetPhone(@Body() dto: ZaloPhoneDto, @Req() req)
  // Dùng tạm body parameter thay req cho đơn giản nếu chưa cài Guard đầy đủ
  zaloMiniAppGetPhone(@Body() dto: ZaloPhoneDto) {
    return this.authService.zaloMiniAppGetPhone(
      dto.customerId,
      dto.access_token,
      dto.token,
    );
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Đăng nhập Admin bằng username/password' })
  @ApiResponse({
    status: 201,
    description: 'Trả về JWT token và thông tin Admin',
  })
  @ApiResponse({ status: 401, description: 'Sai tài khoản hoặc mật khẩu' })
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto.username, dto.password);
  }
}
