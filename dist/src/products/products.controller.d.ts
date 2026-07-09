import { ProductsService } from './products.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductTagDto } from './dto/create-product-tag.dto';
import { UpdateProductTagDto } from './dto/update-product-tag.dto';
type AuthenticatedRequest = {
    user: {
        id: string;
    };
};
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: GetProductsQueryDto): Promise<{
        data: {
            id: string;
            name: string;
            subname: string | null;
            category: import("@prisma/client").$Enums.ProductCategory;
            price: number;
            priceVnd: number;
            rating: number | null;
            image: string | null;
            status: import("@prisma/client").$Enums.ProductStatus;
            details: string | null;
            description: string | null;
            tags: string[];
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
        name: string;
        subname: string | null;
        category: import("@prisma/client").$Enums.ProductCategory;
        price: number;
        priceVnd: number;
        rating: number | null;
        image: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        details: string | null;
        description: string | null;
        tags: string[];
    }>;
    create(dto: CreateProductDto, req: AuthenticatedRequest): Promise<{
        id: string;
        name: string;
        subname: string | null;
        category: import("@prisma/client").$Enums.ProductCategory;
        price: number;
        priceVnd: number;
        rating: number | null;
        image: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        details: string | null;
        description: string | null;
        tags: string[];
    }>;
    update(id: string, dto: UpdateProductDto, req: AuthenticatedRequest): Promise<{
        id: string;
        name: string;
        subname: string | null;
        category: import("@prisma/client").$Enums.ProductCategory;
        price: number;
        priceVnd: number;
        rating: number | null;
        image: string | null;
        status: import("@prisma/client").$Enums.ProductStatus;
        details: string | null;
        description: string | null;
        tags: string[];
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    createTag(productId: string, dto: CreateProductTagDto, req: AuthenticatedRequest): Promise<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
        product_id: string;
    }>;
    updateTag(tagId: string, dto: UpdateProductTagDto, req: AuthenticatedRequest): Promise<{
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        created_by_admin_id: string | null;
        updated_by_admin_id: string | null;
        product_id: string;
    } | {
        message: string;
    }>;
    removeTag(tagId: string): Promise<{
        message: string;
    }>;
}
export {};
