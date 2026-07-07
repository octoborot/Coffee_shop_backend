import { NotificationType } from '@prisma/client';
export declare class CreateNotificationDto {
    customer_id?: string;
    title: string;
    description: string;
    type: NotificationType;
    image?: string;
}
