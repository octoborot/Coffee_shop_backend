import { AuthService } from './auth.service';
import { ZaloLoginDto } from './dto/zalo-login.dto';
import { ZaloMiniAppLoginDto } from './dto/zalo-miniapp-login.dto';
import { ZaloPhoneDto } from './dto/zalo-phone.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    zaloLogin(dto: ZaloLoginDto): Promise<{
        access_token: string;
        customer: {
            id: string;
            name: string;
            created_at: Date;
            zalo_id: string;
            phone: string | null;
            email: string | null;
            avatar_text: string | null;
        };
    }>;
    zaloMiniAppLogin(dto: ZaloMiniAppLoginDto): Promise<{
        access_token: string;
        customer: {
            id: string;
            name: string;
            created_at: Date;
            zalo_id: string;
            phone: string | null;
            email: string | null;
            avatar_text: string | null;
        };
    }>;
    zaloMiniAppGetPhone(dto: ZaloPhoneDto): Promise<{
        phone: any;
        message: string;
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
