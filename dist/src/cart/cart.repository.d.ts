import { PrismaService } from '../prisma/prisma.service';
export declare class CartRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findCartByCustomerId(customerId: string): import("@prisma/client").Prisma.Prisma__CartClient<({
        items: ({
            product: {
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
            };
        } & {
            id: string;
            created_at: Date;
            updated_at: Date;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            product_id: string;
            quantity: number;
            cart_id: string;
        })[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        customer_id: string;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    createCart(customerId: string): import("@prisma/client").Prisma.Prisma__CartClient<{
        id: string;
        created_at: Date;
        updated_at: Date;
        customer_id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findOrCreateCart(customerId: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            created_at: Date;
            updated_at: Date;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            product_id: string;
            quantity: number;
            cart_id: string;
        })[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        customer_id: string;
    }>;
    findProductById(productId: string): import("@prisma/client").Prisma.Prisma__ProductClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAvailableProductById(productId: string): import("@prisma/client").Prisma.Prisma__ProductClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    createCartItem(data: {
        cart_id: string;
        product_id: string;
        quantity: number;
        options?: Record<string, string>;
    }): import("@prisma/client").Prisma.Prisma__CartItemClient<{
        id: string;
        created_at: Date;
        updated_at: Date;
        options: import("@prisma/client/runtime/client").JsonValue | null;
        product_id: string;
        quantity: number;
        cart_id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateCartItem(itemId: string, data: {
        quantity?: number;
        options?: Record<string, string>;
    }): import("@prisma/client").Prisma.Prisma__CartItemClient<{
        id: string;
        created_at: Date;
        updated_at: Date;
        options: import("@prisma/client/runtime/client").JsonValue | null;
        product_id: string;
        quantity: number;
        cart_id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    deleteCartItem(itemId: string): import("@prisma/client").Prisma.Prisma__CartItemClient<{
        id: string;
        created_at: Date;
        updated_at: Date;
        options: import("@prisma/client/runtime/client").JsonValue | null;
        product_id: string;
        quantity: number;
        cart_id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    deleteCartItems(cartId: string): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
    findCartItemByIdAndCustomerId(itemId: string, customerId: string): import("@prisma/client").Prisma.Prisma__CartItemClient<({
        product: {
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
        };
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        options: import("@prisma/client/runtime/client").JsonValue | null;
        product_id: string;
        quantity: number;
        cart_id: string;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
