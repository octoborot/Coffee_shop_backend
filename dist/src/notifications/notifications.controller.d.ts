import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetNotificationsQueryDto } from './dto/get-notifications-query.dto';
type AuthenticatedRequest = {
    user: {
        id: string;
    };
};
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findForCustomer(req: AuthenticatedRequest, query: GetNotificationsQueryDto): Promise<{
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
    create(dto: CreateNotificationDto, req: AuthenticatedRequest): import("@prisma/client").Prisma.Prisma__NotificationClient<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
export {};
