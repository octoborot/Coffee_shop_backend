import { PrismaService } from '../prisma/prisma.service';
export declare class CustomerRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): import("@prisma/client").Prisma.Prisma__CustomerClient<({
        addresses: {
            id: string;
            created_at: Date;
            updated_at: Date;
            phone: string | null;
            customer_id: string;
            address: string;
            label: string | null;
            receiver: string | null;
            is_default: boolean;
        }[];
        orders: ({
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
        })[];
    } & {
        id: string;
        name: string;
        created_at: Date;
        zalo_id: string;
        phone: string | null;
        email: string | null;
        avatar_text: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: {
        name?: string;
        email?: string;
    }): import("@prisma/client").Prisma.Prisma__CustomerClient<{
        id: string;
        name: string;
        created_at: Date;
        zalo_id: string;
        phone: string | null;
        email: string | null;
        avatar_text: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    createAddress(customerId: string, data: {
        label?: string;
        receiver: string;
        phone: string;
        address: string;
        is_default?: boolean;
    }): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        phone: string | null;
        customer_id: string;
        address: string;
        label: string | null;
        receiver: string | null;
        is_default: boolean;
    }>;
    getAddresses(customerId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        phone: string | null;
        customer_id: string;
        address: string;
        label: string | null;
        receiver: string | null;
        is_default: boolean;
    }[]>;
    getAddressById(addressId: string): import("@prisma/client").Prisma.Prisma__CustomerAddressClient<{
        id: string;
        created_at: Date;
        updated_at: Date;
        phone: string | null;
        customer_id: string;
        address: string;
        label: string | null;
        receiver: string | null;
        is_default: boolean;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateAddress(customerId: string, addressId: string, data: {
        label?: string;
        receiver?: string;
        phone?: string;
        address?: string;
        is_default?: boolean;
    }): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        phone: string | null;
        customer_id: string;
        address: string;
        label: string | null;
        receiver: string | null;
        is_default: boolean;
    }>;
    deleteAddress(addressId: string): import("@prisma/client").Prisma.Prisma__CustomerAddressClient<{
        id: string;
        created_at: Date;
        updated_at: Date;
        phone: string | null;
        customer_id: string;
        address: string;
        label: string | null;
        receiver: string | null;
        is_default: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
