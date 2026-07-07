import { ProductCategory, ProductStatus } from '@prisma/client';
export declare class CreateProductDto {
    name: string;
    subname?: string;
    category: ProductCategory;
    price: number;
    price_vnd: number;
    rating?: number;
    image?: string;
    status?: ProductStatus;
    details?: string;
    description?: string;
    tags?: string[];
}
