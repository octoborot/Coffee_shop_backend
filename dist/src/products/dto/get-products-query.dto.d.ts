import { ProductCategory, ProductStatus } from '@prisma/client';
export declare class GetProductsQueryDto {
    category?: ProductCategory;
    status?: ProductStatus;
    tag?: string;
    search?: string;
    page: number;
    limit: number;
}
