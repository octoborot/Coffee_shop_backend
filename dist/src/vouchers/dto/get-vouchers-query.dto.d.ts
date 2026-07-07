import { DiscountType, ProductCategory } from '@prisma/client';
export declare class GetVouchersQueryDto {
    discount_type?: DiscountType;
    category?: ProductCategory;
    is_active?: boolean;
    search?: string;
    page: number;
    limit: number;
}
