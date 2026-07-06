import { ProductsService } from './products.service';
import { ProductCategory, ProductStatus } from '@prisma/client';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(category?: ProductCategory, status?: ProductStatus): import("@prisma/client").Prisma.PrismaPromise<{
        category: import("@prisma/client").$Enums.ProductCategory;
        status: import("@prisma/client").$Enums.ProductStatus;
        id: string;
        name: string;
        subname: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        price_vnd: number;
        image: string | null;
        details: string | null;
        created_at: Date;
        updated_at: Date;
    }[]>;
    findOne(id: string): Promise<{
        category: import("@prisma/client").$Enums.ProductCategory;
        status: import("@prisma/client").$Enums.ProductStatus;
        id: string;
        name: string;
        subname: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        price_vnd: number;
        image: string | null;
        details: string | null;
        created_at: Date;
        updated_at: Date;
    }>;
}
