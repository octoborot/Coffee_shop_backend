import { CustomerRepository } from './customer.repository';
import { CreateCustomerAddressDto, UpdateCustomerAddressDto } from './dto/customer-address.dto';
export declare class CustomerService {
    private readonly customerRepository;
    constructor(customerRepository: CustomerRepository);
    getProfile(customerId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        avatar_text: string | null;
        created_at: Date;
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
        recent_orders: ({
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
    }>;
    updateProfile(customerId: string, data: {
        name?: string;
        email?: string;
    }): Promise<{
        id: string;
        name: string;
        created_at: Date;
        zalo_id: string;
        phone: string | null;
        email: string | null;
        avatar_text: string | null;
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
    createAddress(customerId: string, dto: CreateCustomerAddressDto): Promise<{
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
    updateAddress(customerId: string, addressId: string, dto: UpdateCustomerAddressDto): Promise<{
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
    deleteAddress(customerId: string, addressId: string): Promise<{
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
}
