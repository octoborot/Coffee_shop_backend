import { NotificationType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
interface FindAllNotificationsParams {
    customerId?: string;
    type?: NotificationType;
    is_read?: boolean;
    page: number;
    limit: number;
    includeSystem?: boolean;
}
export declare class NotificationsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(params: FindAllNotificationsParams): Promise<{
        items: {
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
        total: number;
    }>;
    findById(id: string): Prisma.Prisma__NotificationClient<{
        id: string;
        image: string | null;
        description: string;
        created_at: Date;
        created_by_admin_id: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        customer_id: string | null;
        is_read: boolean;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    create(data: CreateNotificationDto, adminId?: string): Prisma.Prisma__NotificationClient<{
        id: string;
        image: string | null;
        description: string;
        created_at: Date;
        created_by_admin_id: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        customer_id: string | null;
        is_read: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, data: UpdateNotificationDto): Prisma.Prisma__NotificationClient<{
        id: string;
        image: string | null;
        description: string;
        created_at: Date;
        created_by_admin_id: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        customer_id: string | null;
        is_read: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    markAsRead(id: string): Prisma.Prisma__NotificationClient<{
        id: string;
        image: string | null;
        description: string;
        created_at: Date;
        created_by_admin_id: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        customer_id: string | null;
        is_read: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    delete(id: string): Prisma.Prisma__NotificationClient<{
        id: string;
        image: string | null;
        description: string;
        created_at: Date;
        created_by_admin_id: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        customer_id: string | null;
        is_read: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
}
export {};
