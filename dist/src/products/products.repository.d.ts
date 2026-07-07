import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProductCategory, ProductStatus } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
interface FindAllProductsParams {
    category?: ProductCategory;
    status?: ProductStatus;
    tag?: string;
    search?: string;
    page: number;
    limit: number;
}
export declare class ProductsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(params: FindAllProductsParams): Promise<{
        items: ({
            tags: {
                id: string;
                name: string;
                created_at: Date;
                updated_at: Date;
                created_by_admin_id: string | null;
                updated_by_admin_id: string | null;
                product_id: string;
            }[];
        } & {
            id: string;
            name: string;
            subname: string | null;
            category: import("@prisma/client").$Enums.ProductCategory;
            price: Prisma.Decimal;
            price_vnd: number;
            rating: Prisma.Decimal | null;
            image: string | null;
            status: import("@prisma/client").$Enums.ProductStatus;
            details: string | null;
            description: string | null;
            created_at: Date;
            updated_at: Date;
            created_by_admin_id: string | null;
            updated_by_admin_id: string | null;
        })[];
        total: number;
    }>;
    findById(id: string): Prisma.Prisma__ProductClient<({
        tags: {
            id: string;
            name: string;
            created_at: Date;
            updated_at: Date;
            created_by_admin_id: string | null;
            updated_by_admin_id: string | null;
            product_id: string;
        }[];
    } & {
        id: string;
        name: string;
        subname: string | null;
        category: import("@prisma/client").$Enums.ProductCategory;
        price: Prisma.Decimal;
        price_vnd: number;
        rating: Prisma.Decimal | null;
        image: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        details: string | null;
        description: string | null;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    create(data: CreateProductDto, adminId?: string): Prisma.Prisma__ProductClient<{
        tags: {
            id: string;
            name: string;
            created_at: Date;
            updated_at: Date;
            created_by_admin_id: string | null;
            updated_by_admin_id: string | null;
            product_id: string;
        }[];
    } & {
        id: string;
        name: string;
        subname: string | null;
        category: import("@prisma/client").$Enums.ProductCategory;
        price: Prisma.Decimal;
        price_vnd: number;
        rating: Prisma.Decimal | null;
        image: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        details: string | null;
        description: string | null;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, data: UpdateProductDto, adminId?: string): Prisma.Prisma__ProductClient<{
        tags: {
            id: string;
            name: string;
            created_at: Date;
            updated_at: Date;
            created_by_admin_id: string | null;
            updated_by_admin_id: string | null;
            product_id: string;
        }[];
    } & {
        id: string;
        name: string;
        subname: string | null;
        category: import("@prisma/client").$Enums.ProductCategory;
        price: Prisma.Decimal;
        price_vnd: number;
        rating: Prisma.Decimal | null;
        image: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        details: string | null;
        description: string | null;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    delete(id: string): Prisma.Prisma__ProductClient<{
        id: string;
        name: string;
        subname: string | null;
        category: import("@prisma/client").$Enums.ProductCategory;
        price: Prisma.Decimal;
        price_vnd: number;
        rating: Prisma.Decimal | null;
        image: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        details: string | null;
        description: string | null;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    createTag(productId: string, name: string, adminId?: string): Prisma.Prisma__ProductTagClient<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
        product_id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    updateTag(tagId: string, name: string, adminId?: string): Prisma.Prisma__ProductTagClient<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
        product_id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    deleteTag(tagId: string): Prisma.Prisma__ProductTagClient<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
        product_id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
}
export {};
