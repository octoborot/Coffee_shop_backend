import { DiscountType, ProductCategory } from '@prisma/client';
export declare class CreateVoucherDto {
    code: string;
    title: string;
    description?: string;
    image?: string;
    discount_type: DiscountType;
    discount_value: number;
    min_order_vnd?: number;
    max_discount_vnd?: number;
    applicable_categories?: ProductCategory[];
    starts_at?: string;
    ends_at?: string;
    usage_limit?: number;
    is_active?: boolean;
}
