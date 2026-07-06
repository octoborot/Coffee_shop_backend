import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
export declare class AuthService {
    private readonly authRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(authRepository: AuthRepository, jwtService: JwtService, configService: ConfigService);
    zaloLogin(code: string): Promise<{
        access_token: string;
        customer: {
            id: string;
            name: string;
            zalo_id: string;
            phone: string | null;
            email: string | null;
            avatar_text: string | null;
            member_card_id: string | null;
            membership: import("@prisma/client").$Enums.MembershipLevel | null;
            points: number;
            last_purchase: Date | null;
            created_at: Date;
        };
    }>;
    adminLogin(username: string, password: string): Promise<{
        access_token: string;
        admin: {
            id: string;
            username: string;
            role: import("@prisma/client").$Enums.AdminRole;
        };
    }>;
}
