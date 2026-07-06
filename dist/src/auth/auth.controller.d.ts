import { AuthService } from './auth.service';
import { ZaloLoginDto } from './dto/zalo-login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    zaloLogin(dto: ZaloLoginDto): Promise<{
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
    adminLogin(dto: AdminLoginDto): Promise<{
        access_token: string;
        admin: {
            id: string;
            username: string;
            role: import("@prisma/client").$Enums.AdminRole;
        };
    }>;
}
