import { PrismaService } from '../prisma/prisma.service';
export declare class AuthRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findCustomerByZaloId(zaloId: string): import("@prisma/client").Prisma.Prisma__CustomerClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    createCustomer(data: {
        zalo_id: string;
        name: string;
        phone?: string;
        avatar_text?: string;
    }): import("@prisma/client").Prisma.Prisma__CustomerClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAdminByUsername(username: string): import("@prisma/client").Prisma.Prisma__AdminUserClient<{
        id: string;
        username: string;
        password_hash: string;
        role: import("@prisma/client").$Enums.AdminRole;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
