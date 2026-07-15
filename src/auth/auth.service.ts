import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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
      const tokenRes = await axios.get(
        'https://oauth.zaloapp.com/v4/oa/access_token',
        {
          params: { app_id: appId, code, grant_type: 'authorization_code' },
          headers: { secret_key: secretKey },
        },
      );
      accessToken = tokenRes.data?.access_token;
      if (!accessToken) throw new Error('No access_token');
    } catch {
      throw new BadRequestException(
        'Không thể xác thực với Zalo. Code không hợp lệ hoặc đã hết hạn.',
      );
    }

    // Bước 2: Dùng access_token lấy thông tin user
    let zaloUser: { id: string; name: string };
    try {
      const appsecret_proof = crypto
        .createHmac('sha256', secretKey || '')
        .update(accessToken)
        .digest('hex');

      const userRes = await axios.get('https://graph.zalo.me/v2.0/me', {
        params: { fields: 'id,name,picture' },
        headers: {
          access_token: accessToken,
          appsecret_proof: appsecret_proof,
        },
      });
      zaloUser = userRes.data;
    } catch (err) {
      console.error(
        'Error fetching Zalo profile in zaloLogin:',
        err?.response?.data || err,
      );
      throw new BadRequestException(
        'Không thể lấy thông tin người dùng từ Zalo.',
      );
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

  // ─── Zalo Mini App SDK Login (Direct Access Token) ──────────────────────────
  async zaloMiniAppLogin(dto: any) {
    // Type as any here to avoid cyclic imports or import issues, or just use it since it's passed from controller
    const { access_token: accessToken, zalo_id, name } = dto;
    if (!accessToken) {
      throw new BadRequestException('Access token không được để trống.');
    }

    let zaloUser: any = { id: zalo_id, name: name };
    try {
      const appSecret = this.configService.get<string>('ZALO_APP_SECRET');
      const appsecret_proof = crypto
        .createHmac('sha256', appSecret || '')
        .update(accessToken)
        .digest('hex');

      const userRes = await axios.get('https://graph.zalo.me/v2.0/me', {
        params: { fields: 'id,name,picture' },
        headers: {
          access_token: accessToken,
          appsecret_proof: appsecret_proof,
        },
      });
      if (userRes.data && !userRes.data.error) {
        zaloUser = userRes.data;
      } else if (!zalo_id) {
        throw new BadRequestException(
          `Lỗi từ Zalo: ${userRes.data.message || 'Unknown error'}`,
        );
      }
    } catch (err: any) {
      console.warn(
        'Zalo API Error, falling back to frontend data if available:',
        err?.response?.data || err.message,
      );
      if (!zalo_id || !name) {
        throw new BadRequestException(
          'Không thể lấy thông tin người dùng từ Zalo và không có dữ liệu dự phòng. Lỗi: ' +
            (err?.response?.data?.message || err.message),
        );
      }
    }

    // Tìm hoặc tạo Customer trong DB
    let customer = await this.authRepository.findCustomerByZaloId(zaloUser.id);
    if (!customer) {
      customer = await this.authRepository.createCustomer({
        zalo_id: zaloUser.id,
        name: zaloUser.name,
        avatar_text: zaloUser.name.charAt(0).toUpperCase(),
      });
    }

    // Tạo và trả về JWT
    const jwtToken = this.jwtService.sign({
      sub: customer.id,
      role: 'customer',
    });

    return { access_token: jwtToken, customer };
  }

  // ─── Giải mã số điện thoại từ Zalo Mini App ─────────────────────────────────
  async zaloMiniAppGetPhone(
    customerId: string,
    accessToken: string,
    token: string,
  ) {
    const secretKey = this.configService.get<string>('ZALO_APP_SECRET');

    if (!secretKey) {
      throw new BadRequestException('Chưa cấu hình ZALO_APP_SECRET');
    }

    try {
      const response = await axios.get('https://graph.zalo.me/v2.0/me/info', {
        headers: {
          access_token: accessToken,
          code: token,
          secret_key: secretKey,
        },
      });

      const data = response.data;
      if (data.error) {
        throw new BadRequestException(
          `Lỗi giải mã số điện thoại: ${data.message}`,
        );
      }

      const phone = data.data?.number;
      if (!phone) {
        throw new BadRequestException(
          'Không tìm thấy số điện thoại trong payload.',
        );
      }

      // Cập nhật số điện thoại cho Customer
      await this.authRepository.updateCustomerPhone(customerId, phone);

      return { phone, message: 'Cập nhật số điện thoại thành công' };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(
        'Không thể gọi API Zalo để lấy số điện thoại.',
      );
    }
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
