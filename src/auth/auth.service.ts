import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Zalo Mini App Login ────────────────────────────────────────────────────
  async zaloLogin(code: string) {
    const appId = this.configService.get<string>('ZALO_APP_ID');
    const secretKey = this.configService.get<string>('ZALO_APP_SECRET');

    // Bước 1: Đổi code lấy access_token
    let accessToken: string;
    try {
      const tokenRes = await axios.get('https://oauth.zaloapp.com/v4/oa/access_token', {
        params: { app_id: appId, code, grant_type: 'authorization_code' },
        headers: { secret_key: secretKey },
      });
      accessToken = tokenRes.data?.access_token;
      if (!accessToken) throw new Error('No access_token');
    } catch {
      throw new BadRequestException('Không thể xác thực với Zalo. Code không hợp lệ hoặc đã hết hạn.');
    }

    // Bước 2: Dùng access_token lấy thông tin user
    let zaloUser: { id: string; name: string };
    try {
      const userRes = await axios.get('https://graph.zalo.me/v2.0/me', {
        params: { fields: 'id,name,picture' },
        headers: { access_token: accessToken },
      });
      zaloUser = userRes.data;
    } catch {
      throw new BadRequestException('Không thể lấy thông tin người dùng từ Zalo.');
    }

    // Bước 3: Tìm hoặc tạo Customer trong DB
    let customer = await this.authRepository.findCustomerByZaloId(zaloUser.id);
    if (!customer) {
      customer = await this.authRepository.createCustomer({
        zalo_id: zaloUser.id,
        name: zaloUser.name,
        avatar_text: zaloUser.name.charAt(0).toUpperCase(),
      });
    }

    // Bước 4: Tạo và trả về JWT
    const token = this.jwtService.sign({
      sub: customer.id,
      role: 'customer',
    });

    return { access_token: token, customer };
  }

  // ─── Admin Login ─────────────────────────────────────────────────────────────
  async adminLogin(username: string, password: string) {
    const admin = await this.authRepository.findAdminByUsername(username);
    if (!admin) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng.');
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng.');
    }

    const token = this.jwtService.sign({
      sub: admin.id,
      role: admin.role.toLowerCase(),
      username: admin.username,
    });

    return {
      access_token: token,
      admin: { id: admin.id, username: admin.username, role: admin.role },
    };
  }
}
