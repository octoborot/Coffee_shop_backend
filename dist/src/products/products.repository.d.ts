import { PrismaService } from '../prisma/prisma.service';
import { ProductCategory, ProductStatus } from '@prisma/client';
export declare class ProductsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: {
        category?: ProductCategory;
        status?: ProductStatus;
    }): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        subname: string | null;
        category: import("@prisma/client").$Enums.ProductCategory;
        price: import("@prisma/client-runtime-utils").Decimal;
        price_vnd: number;
        rating: import("@prisma/client-runtime-utils").Decimal | null;
        image: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        details: string | null;
        description: string | null;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
    }[]>;
    findById(id: string): import("@prisma/client").Prisma.Prisma__ProductClient<{
        id: string;
        name: string;
        subname: string | null;
        category: import("@prisma/client").$Enums.ProductCategory;
        price: import("@prisma/client-runtime-utils").Decimal;
        price_vnd: number;
        rating: import("@prisma/client-runtime-utils").Decimal | null;
        image: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        details: string | null;
        description: string | null;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
