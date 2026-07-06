import { ProductsService } from './products.service';
import { ProductCategory, ProductStatus } from '@prisma/client';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(category?: ProductCategory, status?: ProductStatus): import("@prisma/client").Prisma.PrismaPromise<{
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
    findOne(id: string): Promise<{
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
    }>;
}
