import { CreateVoucherDto } from './dto/create-voucher.dto';
import { GetVouchersQueryDto } from './dto/get-vouchers-query.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VouchersService } from './vouchers.service';
type AuthenticatedRequest = {
    user: {
        id: string;
    };
};
export declare class VouchersController {
    private readonly vouchersService;
    constructor(vouchersService: VouchersService);
    findActive(query: GetVouchersQueryDto): Promise<{
        data: {
            id: string;
            image: string | null;
            description: string | null;
            created_at: Date;
            updated_at: Date;
            created_by_admin_id: string | null;
            updated_by_admin_id: string | null;
            code: string;
            title: string;
            discount_type: import("@prisma/client").$Enums.DiscountType;
            discount_value: number;
            min_order_vnd: number;
            max_discount_vnd: number | null;
            applicable_categories: import("@prisma/client").$Enums.ProductCategory[];
            starts_at: Date | null;
            ends_at: Date | null;
            usage_limit: number | null;
            used_count: number;
            is_active: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findByCode(code: string): Promise<{
        id: string;
        image: string | null;
        description: string | null;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
        code: string;
        title: string;
        discount_type: import("@prisma/client").$Enums.DiscountType;
        discount_value: number;
        min_order_vnd: number;
        max_discount_vnd: number | null;
        applicable_categories: import("@prisma/client").$Enums.ProductCategory[];
        starts_at: Date | null;
        ends_at: Date | null;
        usage_limit: number | null;
        used_count: number;
        is_active: boolean;
    }>;
    findAll(query: GetVouchersQueryDto): Promise<{
        data: {
            id: string;
            image: string | null;
            description: string | null;
            created_at: Date;
            updated_at: Date;
            created_by_admin_id: string | null;
            updated_by_admin_id: string | null;
            code: string;
            title: string;
            discount_type: import("@prisma/client").$Enums.DiscountType;
            discount_value: number;
            min_order_vnd: number;
            max_discount_vnd: number | null;
            applicable_categories: import("@prisma/client").$Enums.ProductCategory[];
            starts_at: Date | null;
            ends_at: Date | null;
            usage_limit: number | null;
            used_count: number;
            is_active: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        image: string | null;
        description: string | null;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
        code: string;
        title: string;
        discount_type: import("@prisma/client").$Enums.DiscountType;
        discount_value: number;
        min_order_vnd: number;
        max_discount_vnd: number | null;
        applicable_categories: import("@prisma/client").$Enums.ProductCategory[];
        starts_at: Date | null;
        ends_at: Date | null;
        usage_limit: number | null;
        used_count: number;
        is_active: boolean;
    }>;
    create(dto: CreateVoucherDto, req: AuthenticatedRequest): import("@prisma/client").Prisma.Prisma__VoucherClient<{
        id: string;
        image: string | null;
        description: string | null;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
        code: string;
        title: string;
        discount_type: import("@prisma/client").$Enums.DiscountType;
        discount_value: number;
        min_order_vnd: number;
        max_discount_vnd: number | null;
        applicable_categories: import("@prisma/client").$Enums.ProductCategory[];
        starts_at: Date | null;
        ends_at: Date | null;
        usage_limit: number | null;
        used_count: number;
        is_active: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateVoucherDto, req: AuthenticatedRequest): Promise<{
        id: string;
        image: string | null;
        description: string | null;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
        code: string;
        title: string;
        discount_type: import("@prisma/client").$Enums.DiscountType;
        discount_value: number;
        min_order_vnd: number;
        max_discount_vnd: number | null;
        applicable_categories: import("@prisma/client").$Enums.ProductCategory[];
        starts_at: Date | null;
        ends_at: Date | null;
        usage_limit: number | null;
        used_count: number;
        is_active: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
export {};
