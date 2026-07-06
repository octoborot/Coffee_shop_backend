import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(dto: CreateOrderDto, req: any): Promise<{
        order: {
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
        };
        zp_trans_token: any;
    } | {
        order: {
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
        };
        zp_trans_token?: undefined;
    }>;
    createGuestOrder(dto: CreateOrderDto): Promise<{
        order: {
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
        };
        zp_trans_token: any;
    } | {
        order: {
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
        };
        zp_trans_token?: undefined;
    }>;
    getOrderHistory(req: any): import("@prisma/client").Prisma.PrismaPromise<({
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
    getOrderById(id: string): Promise<{
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
    getAdminOrders(status?: OrderStatus): import("@prisma/client").Prisma.PrismaPromise<({
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
    updateOrderStatus(id: string, dto: UpdateOrderStatusDto): import("@prisma/client").Prisma.Prisma__OrderClient<{
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
