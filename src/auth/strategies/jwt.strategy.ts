import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string; // user id (customer or admin)
  role: 'customer' | 'admin' | 'staff';
  username?: string; // chỉ dành cho admin
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.role === 'admin') {
      const admin = await this.prisma.adminUser.findUnique({
        where: { id: payload.sub },
        select: { id: true, role: true, username: true },
      });
      if (!admin)
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn.');
      return {
        id: admin.id,
        role: admin.role.toLowerCase(),
        username: admin.username,
      };
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: payload.sub },
      select: { id: true },
    });
    if (!customer)
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn.');
    return { id: customer.id, role: 'customer' };
  }
}
