import { Prisma } from '@prisma/client';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartRepository } from './cart.repository';
import { AddCartItemDto } from './dto/add-cart-item.dto';
export declare class CartService {
    private readonly cartRepository;
    constructor(cartRepository: CartRepository);
    getCart(customerId: string): Promise<{
        id: string;
        customer_id: string;
        items: {
            id: string;
            product_id: string;
            quantity: number;
            options: Prisma.JsonValue;
            product: {
                id: string;
                name: string;
                subname: string | null;
                price_vnd: number;
                image: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
            };
            line_total_vnd: number;
        }[];
        subtotal_vnd: number;
    }>;
    addItem(customerId: string, dto: AddCartItemDto): Promise<{
        id: string;
        customer_id: string;
        items: {
            id: string;
            product_id: string;
            quantity: number;
            options: Prisma.JsonValue;
            product: {
                id: string;
                name: string;
                subname: string | null;
                price_vnd: number;
                image: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
            };
            line_total_vnd: number;
        }[];
        subtotal_vnd: number;
    }>;
    clearCart(customerId: string): Promise<{
        id: string;
        customer_id: string;
        items: {
            id: string;
            product_id: string;
            quantity: number;
            options: Prisma.JsonValue;
            product: {
                id: string;
                name: string;
                subname: string | null;
                price_vnd: number;
                image: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
            };
            line_total_vnd: number;
        }[];
        subtotal_vnd: number;
    }>;
    updateItem(customerId: string, itemId: string, dto: UpdateCartDto): Promise<{
        id: string;
        customer_id: string;
        items: {
            id: string;
            product_id: string;
            quantity: number;
            options: Prisma.JsonValue;
            product: {
                id: string;
                name: string;
                subname: string | null;
                price_vnd: number;
                image: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
            };
            line_total_vnd: number;
        }[];
        subtotal_vnd: number;
    }>;
    removeItem(customerId: string, itemId: string): Promise<{
        id: string;
        customer_id: string;
        items: {
            id: string;
            product_id: string;
            quantity: number;
            options: Prisma.JsonValue;
            product: {
                id: string;
                name: string;
                subname: string | null;
                price_vnd: number;
                image: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
            };
            line_total_vnd: number;
        }[];
        subtotal_vnd: number;
    }>;
    private formatCart;
    private stringifyOptions;
}
