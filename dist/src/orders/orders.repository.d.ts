import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, OrderType, PaymentStatus } from '@prisma/client';
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
            zalo_id: string;
            phone: string | null;
            email: string | null;
            avatar_text: string | null;
            member_card_id: string | null;
            membership: import("@prisma/client").$Enums.MembershipLevel | null;
            points: number;
            last_purchase: Date | null;
            created_at: Date;
        } | null;
        items: {
            id: string;
            name: string;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            order_id: string;
            product_id: string | null;
            quantity: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            price_vnd: number;
        }[];
    } & {
        id: string;
        created_at: Date;
        type: import("@prisma/client").$Enums.OrderType;
        total_price_vnd: number;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        customer_id: string | null;
        customer_name: string | null;
        customer_phone: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        note: string | null;
        address: string | null;
        updated_at: Date;
    }>;
    addPointsToCustomer(customerId: string, points: number): import("@prisma/client").Prisma.Prisma__CustomerClient<{
        id: string;
        name: string;
        zalo_id: string;
        phone: string | null;
        email: string | null;
        avatar_text: string | null;
        member_card_id: string | null;
        membership: import("@prisma/client").$Enums.MembershipLevel | null;
        points: number;
        last_purchase: Date | null;
        created_at: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByCustomerId(customerId: string): import("@prisma/client").Prisma.PrismaPromise<({
        items: {
            id: string;
            name: string;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            order_id: string;
            product_id: string | null;
            quantity: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            price_vnd: number;
        }[];
    } & {
        id: string;
        created_at: Date;
        type: import("@prisma/client").$Enums.OrderType;
        total_price_vnd: number;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        customer_id: string | null;
        customer_name: string | null;
        customer_phone: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        note: string | null;
        address: string | null;
        updated_at: Date;
    })[]>;
    findById(id: string): import("@prisma/client").Prisma.Prisma__OrderClient<({
        customer: {
            id: string;
            name: string;
            zalo_id: string;
            phone: string | null;
            email: string | null;
            avatar_text: string | null;
            member_card_id: string | null;
            membership: import("@prisma/client").$Enums.MembershipLevel | null;
            points: number;
            last_purchase: Date | null;
            created_at: Date;
        } | null;
        items: {
            id: string;
            name: string;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            order_id: string;
            product_id: string | null;
            quantity: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            price_vnd: number;
        }[];
    } & {
        id: string;
        created_at: Date;
        type: import("@prisma/client").$Enums.OrderType;
        total_price_vnd: number;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        customer_id: string | null;
        customer_name: string | null;
        customer_phone: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        note: string | null;
        address: string | null;
        updated_at: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(filters?: {
        status?: OrderStatus;
    }): import("@prisma/client").Prisma.PrismaPromise<({
        customer: {
            id: string;
            name: string;
            phone: string | null;
            membership: import("@prisma/client").$Enums.MembershipLevel | null;
        } | null;
        items: {
            id: string;
            name: string;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            order_id: string;
            product_id: string | null;
            quantity: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            price_vnd: number;
        }[];
    } & {
        id: string;
        created_at: Date;
        type: import("@prisma/client").$Enums.OrderType;
        total_price_vnd: number;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        customer_id: string | null;
        customer_name: string | null;
        customer_phone: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        note: string | null;
        address: string | null;
        updated_at: Date;
    })[]>;
    updateStatus(id: string, status: OrderStatus): import("@prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        created_at: Date;
        type: import("@prisma/client").$Enums.OrderType;
        total_price_vnd: number;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        customer_id: string | null;
        customer_name: string | null;
        customer_phone: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        note: string | null;
        address: string | null;
        updated_at: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
