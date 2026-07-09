import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
type AuthenticatedRequest = {
    user: {
        id: string;
    };
};
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: AuthenticatedRequest): Promise<{
        id: string;
        customer_id: string;
        items: {
            id: string;
            product_id: string;
            quantity: number;
            options: import("@prisma/client/runtime/client").JsonValue;
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
    addItem(req: AuthenticatedRequest, dto: AddCartItemDto): Promise<{
        id: string;
        customer_id: string;
        items: {
            id: string;
            product_id: string;
            quantity: number;
            options: import("@prisma/client/runtime/client").JsonValue;
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
    updateItem(req: AuthenticatedRequest, id: string, dto: UpdateCartDto): Promise<{
        id: string;
        customer_id: string;
        items: {
            id: string;
            product_id: string;
            quantity: number;
            options: import("@prisma/client/runtime/client").JsonValue;
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
    removeItem(req: AuthenticatedRequest, id: string): Promise<{
        id: string;
        customer_id: string;
        items: {
            id: string;
            product_id: string;
            quantity: number;
            options: import("@prisma/client/runtime/client").JsonValue;
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
    clearCart(req: AuthenticatedRequest): Promise<{
        id: string;
        customer_id: string;
        items: {
            id: string;
            product_id: string;
            quantity: number;
            options: import("@prisma/client/runtime/client").JsonValue;
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
}
export {};
