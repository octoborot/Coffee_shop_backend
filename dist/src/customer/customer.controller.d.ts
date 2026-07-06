import { CustomerService } from './customer.service';
declare class UpdateProfileDto {
    name?: string;
    email?: string;
}
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    getProfile(req: any): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        avatar_text: string | null;
        member_card_id: string | null;
        points: number;
        membership: import("@prisma/client").$Enums.MembershipLevel;
        last_purchase: Date | null;
        created_at: Date;
        recent_orders: ({
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
        })[];
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
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
    }>;
}
export {};
