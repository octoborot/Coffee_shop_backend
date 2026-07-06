import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, OrderType, PaymentMethod, PaymentStatus } from '@prisma/client';
export declare class OrdersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProductsByIds(productIds: string[]): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        price_vnd: number;
    }[]>;
    createOrderWithItems(data: {
        id: string;
        customer_id?: string;
        customer_name?: string;
        customer_phone?: string;
        type: OrderType;
        payment_method: PaymentMethod;
        subtotal_vnd: number;
        discount_vnd?: number;
        shipping_fee_vnd?: number;
        total_price: number;
        total_price_vnd: number;
        payment_status: PaymentStatus;
        note?: string;
        address?: string;
        items: {
            product_id?: string;
            name: string;
            quantity: number;
            price: number;
            price_vnd: number;
            options?: Record<string, string>;
        }[];
    }): Promise<{
        customer: {
            id: string;
            name: string;
            created_at: Date;
            zalo_id: string;
            phone: string | null;
            email: string | null;
            avatar_text: string | null;
        } | null;
        items: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            price_vnd: number;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            order_id: string;
            product_id: string | null;
            quantity: number;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        created_at: Date;
        updated_at: Date;
        type: import("@prisma/client").$Enums.OrderType;
        total_price_vnd: number;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        subtotal_vnd: number;
        discount_vnd: number;
        shipping_fee_vnd: number;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        customer_id: string | null;
        customer_address_id: string | null;
        store_location_id: string | null;
        voucher_id: string | null;
        handled_by_admin_id: string | null;
        customer_name: string | null;
        customer_phone: string | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod;
        note: string | null;
        address: string | null;
    }>;
    findByCustomerId(customerId: string): import("@prisma/client").Prisma.PrismaPromise<({
        items: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            price_vnd: number;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            order_id: string;
            product_id: string | null;
            quantity: number;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        created_at: Date;
        updated_at: Date;
        type: import("@prisma/client").$Enums.OrderType;
        total_price_vnd: number;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        subtotal_vnd: number;
        discount_vnd: number;
        shipping_fee_vnd: number;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        customer_id: string | null;
        customer_address_id: string | null;
        store_location_id: string | null;
        voucher_id: string | null;
        handled_by_admin_id: string | null;
        customer_name: string | null;
        customer_phone: string | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod;
        note: string | null;
        address: string | null;
    })[]>;
    findById(id: string): import("@prisma/client").Prisma.Prisma__OrderClient<({
        customer: {
            id: string;
            name: string;
            created_at: Date;
            zalo_id: string;
            phone: string | null;
            email: string | null;
            avatar_text: string | null;
        } | null;
        items: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            price_vnd: number;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            order_id: string;
            product_id: string | null;
            quantity: number;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        created_at: Date;
        updated_at: Date;
        type: import("@prisma/client").$Enums.OrderType;
        total_price_vnd: number;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        subtotal_vnd: number;
        discount_vnd: number;
        shipping_fee_vnd: number;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        customer_id: string | null;
        customer_address_id: string | null;
        store_location_id: string | null;
        voucher_id: string | null;
        handled_by_admin_id: string | null;
        customer_name: string | null;
        customer_phone: string | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod;
        note: string | null;
        address: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(filters?: {
        status?: OrderStatus;
    }): import("@prisma/client").Prisma.PrismaPromise<({
        customer: {
            id: string;
            name: string;
            phone: string | null;
        } | null;
        items: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            price_vnd: number;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            order_id: string;
            product_id: string | null;
            quantity: number;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        created_at: Date;
        updated_at: Date;
        type: import("@prisma/client").$Enums.OrderType;
        total_price_vnd: number;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        subtotal_vnd: number;
        discount_vnd: number;
        shipping_fee_vnd: number;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        customer_id: string | null;
        customer_address_id: string | null;
        store_location_id: string | null;
        voucher_id: string | null;
        handled_by_admin_id: string | null;
        customer_name: string | null;
        customer_phone: string | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod;
        note: string | null;
        address: string | null;
    })[]>;
    updateStatus(id: string, status: OrderStatus): import("@prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        created_at: Date;
        updated_at: Date;
        type: import("@prisma/client").$Enums.OrderType;
        total_price_vnd: number;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        subtotal_vnd: number;
        discount_vnd: number;
        shipping_fee_vnd: number;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        customer_id: string | null;
        customer_address_id: string | null;
        store_location_id: string | null;
        voucher_id: string | null;
        handled_by_admin_id: string | null;
        customer_name: string | null;
        customer_phone: string | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod;
        note: string | null;
        address: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
