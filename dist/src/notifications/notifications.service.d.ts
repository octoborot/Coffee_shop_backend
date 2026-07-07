import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetNotificationsQueryDto } from './dto/get-notifications-query.dto';
import { NotificationsRepository } from './notifications.repository';
export declare class NotificationsService {
    private readonly notificationsRepository;
    constructor(notificationsRepository: NotificationsRepository);
    findForCustomer(customerId: string, query: GetNotificationsQueryDto): Promise<{
        data: {
            id: string;
            image: string | null;
            description: string;
            created_at: Date;
            created_by_admin_id: string | null;
            type: import("@prisma/client").$Enums.NotificationType;
            title: string;
            customer_id: string | null;
            is_read: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findAll(query: GetNotificationsQueryDto): Promise<{
        data: {
            id: string;
            image: string | null;
            description: string;
            created_at: Date;
            created_by_admin_id: string | null;
            type: import("@prisma/client").$Enums.NotificationType;
            title: string;
            customer_id: string | null;
            is_read: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        image: string | null;
        description: string;
        created_at: Date;
        created_by_admin_id: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        customer_id: string | null;
        is_read: boolean;
    }>;
    create(dto: CreateNotificationDto, adminId?: string): import("@prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        image: string | null;
        description: string;
        created_at: Date;
        created_by_admin_id: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        customer_id: string | null;
        is_read: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateNotificationDto): Promise<{
        id: string;
        image: string | null;
        description: string;
        created_at: Date;
        created_by_admin_id: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        customer_id: string | null;
        is_read: boolean;
    }>;
    markAsRead(id: string): Promise<{
        id: string;
        image: string | null;
        description: string;
        created_at: Date;
        created_by_admin_id: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        customer_id: string | null;
        is_read: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
