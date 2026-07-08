import { PrismaService } from '../prisma/prisma.service';
export declare class AuthRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findCustomerByZaloId(zaloId: string): import("@prisma/client").Prisma.Prisma__CustomerClient<{
        id: string;
        name: string;
        created_at: Date;
        zalo_id: string;
        phone: string | null;
        email: string | null;
        avatar_text: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    createCustomer(data: {
        zalo_id: string;
        name: string;
        phone?: string;
        avatar_text?: string;
    }): import("@prisma/client").Prisma.Prisma__CustomerClient<{
        id: string;
        name: string;
        created_at: Date;
        zalo_id: string;
        phone: string | null;
        email: string | null;
        avatar_text: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAdminByUsername(username: string): import("@prisma/client").Prisma.Prisma__AdminUserClient<{
        id: string;
        username: string;
        password_hash: string;
        role: import("@prisma/client").$Enums.AdminRole;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateCustomerPhone(customerId: string, phone: string): import("@prisma/client").Prisma.Prisma__CustomerClient<{
        id: string;
        name: string;
        created_at: Date;
        zalo_id: string;
        phone: string | null;
        email: string | null;
        avatar_text: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
