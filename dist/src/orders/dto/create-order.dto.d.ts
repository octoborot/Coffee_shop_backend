import { OrderType, PaymentMethod } from '@prisma/client';
export declare class OrderItemDto {
    product_id: string;
    quantity: number;
    options?: Record<string, string>;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    type: OrderType;
    address?: string;
    customer_address_id?: string;
    store_location_id?: string;
    voucher_id?: string;
    note?: string;
    payment_method: PaymentMethod;
    customer_name?: string;
    customer_phone?: string;
}
