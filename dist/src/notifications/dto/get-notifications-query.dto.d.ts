import { NotificationType } from '@prisma/client';
export declare class GetNotificationsQueryDto {
    type?: NotificationType;
    is_read?: boolean;
    page: number;
    limit: number;
}
