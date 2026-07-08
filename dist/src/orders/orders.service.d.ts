import { OrderStatus } from '@prisma/client';
import { OrdersRepository } from './orders.repository';
import { OrdersGateway } from '../gateway/orders.gateway';
import { ZaloPayService } from '../zalopay/zalopay.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private readonly ordersRepository;
    private readonly ordersGateway;
    private readonly zaloPayService;
    constructor(ordersRepository: OrdersRepository, ordersGateway: OrdersGateway, zaloPayService: ZaloPayService);
    private generateOrderId;
    createOrder(dto: CreateOrderDto, customerId?: string): Promise<{
        order: {
            items: {
                product_id: string | null;
                quantity: number;
                options: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                name: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                price_vnd: number;
                order_id: string;
            }[];
            customer: {
                id: string;
                phone: string | null;
                created_at: Date;
                name: string;
                zalo_id: string;
                email: string | null;
                avatar_text: string | null;
            } | null;
        } & {
            type: import("@prisma/client").$Enums.OrderType;
            address: string | null;
            customer_address_id: string | null;
            store_location_id: string | null;
            voucher_id: string | null;
            note: string | null;
            payment_method: import("@prisma/client").$Enums.PaymentMethod;
            customer_name: string | null;
            customer_phone: string | null;
            id: string;
            customer_id: string | null;
            created_at: Date;
            updated_at: Date;
            status: import("@prisma/client").$Enums.OrderStatus;
            payment_status: import("@prisma/client").$Enums.PaymentStatus;
            subtotal_vnd: number;
            discount_vnd: number;
            shipping_fee_vnd: number;
            total_price: import("@prisma/client-runtime-utils").Decimal;
            total_price_vnd: number;
            handled_by_admin_id: string | null;
        };
        zalopay: any;
    }>;
    getOrderHistory(customerId: string): import("@prisma/client").Prisma.PrismaPromise<({
        items: {
            product_id: string | null;
            quantity: number;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            price_vnd: number;
            order_id: string;
        }[];
    } & {
        type: import("@prisma/client").$Enums.OrderType;
        address: string | null;
        customer_address_id: string | null;
        store_location_id: string | null;
        voucher_id: string | null;
        note: string | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod;
        customer_name: string | null;
        customer_phone: string | null;
        id: string;
        customer_id: string | null;
        created_at: Date;
        updated_at: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        subtotal_vnd: number;
        discount_vnd: number;
        shipping_fee_vnd: number;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        total_price_vnd: number;
        handled_by_admin_id: string | null;
    })[]>;
    getOrderById(id: string): Promise<{
        items: {
            product_id: string | null;
            quantity: number;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            price_vnd: number;
            order_id: string;
        }[];
        customer: {
            id: string;
            phone: string | null;
            created_at: Date;
            name: string;
            zalo_id: string;
            email: string | null;
            avatar_text: string | null;
        } | null;
    } & {
        type: import("@prisma/client").$Enums.OrderType;
        address: string | null;
        customer_address_id: string | null;
        store_location_id: string | null;
        voucher_id: string | null;
        note: string | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod;
        customer_name: string | null;
        customer_phone: string | null;
        id: string;
        customer_id: string | null;
        created_at: Date;
        updated_at: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        subtotal_vnd: number;
        discount_vnd: number;
        shipping_fee_vnd: number;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        total_price_vnd: number;
        handled_by_admin_id: string | null;
    }>;
    getAdminOrders(status?: OrderStatus): import("@prisma/client").Prisma.PrismaPromise<({
        items: {
            product_id: string | null;
            quantity: number;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            price_vnd: number;
            order_id: string;
        }[];
        customer: {
            id: string;
            phone: string | null;
            name: string;
        } | null;
    } & {
        type: import("@prisma/client").$Enums.OrderType;
        address: string | null;
        customer_address_id: string | null;
        store_location_id: string | null;
        voucher_id: string | null;
        note: string | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod;
        customer_name: string | null;
        customer_phone: string | null;
        id: string;
        customer_id: string | null;
        created_at: Date;
        updated_at: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        subtotal_vnd: number;
        discount_vnd: number;
        shipping_fee_vnd: number;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        total_price_vnd: number;
        handled_by_admin_id: string | null;
    })[]>;
    updateOrderStatus(id: string, dto: UpdateOrderStatusDto): import("@prisma/client").Prisma.Prisma__OrderClient<{
        type: import("@prisma/client").$Enums.OrderType;
        address: string | null;
        customer_address_id: string | null;
        store_location_id: string | null;
        voucher_id: string | null;
        note: string | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod;
        customer_name: string | null;
        customer_phone: string | null;
        id: string;
        customer_id: string | null;
        created_at: Date;
        updated_at: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        payment_status: import("@prisma/client").$Enums.PaymentStatus;
        subtotal_vnd: number;
        discount_vnd: number;
        shipping_fee_vnd: number;
        total_price: import("@prisma/client-runtime-utils").Decimal;
        total_price_vnd: number;
        handled_by_admin_id: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
