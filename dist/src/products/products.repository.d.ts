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
        image: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        details: string | null;
        created_at: Date;
        updated_at: Date;
    }[]>;
    findById(id: string): import("@prisma/client").Prisma.Prisma__ProductClient<{
        id: string;
        name: string;
        subname: string | null;
        category: import("@prisma/client").$Enums.ProductCategory;
        price: import("@prisma/client-runtime-utils").Decimal;
        price_vnd: number;
        image: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        details: string | null;
        created_at: Date;
        updated_at: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
