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
        };
    }>;
    createGuestOrder(dto: CreateOrderDto): Promise<{
        order: {
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
        };
    }>;
    getOrderHistory(req: any): import("@prisma/client").Prisma.PrismaPromise<({
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
    getOrderById(id: string): Promise<{
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
    getAdminOrders(status?: OrderStatus): import("@prisma/client").Prisma.PrismaPromise<({
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
    updateOrderStatus(id: string, dto: UpdateOrderStatusDto): import("@prisma/client").Prisma.Prisma__OrderClient<{
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
