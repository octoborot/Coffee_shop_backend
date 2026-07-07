import { Injectable } from '@nestjs/common';
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

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: FindAllNotificationsParams) {
    const { customerId, type, is_read, page, limit, includeSystem } = params;
    const where: Prisma.NotificationWhereInput = {
      ...(type ? { type } : {}),
      ...(typeof is_read === 'boolean' ? { is_read } : {}),
      ...(customerId
        ? includeSystem
          ? { OR: [{ customer_id: customerId }, { customer_id: null }] }
          : { customer_id: customerId }
        : {}),
    };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  create(data: CreateNotificationDto, adminId?: string) {
    return this.prisma.notification.create({
      data: {
        ...data,
        created_by_admin_id: adminId,
      },
    });
  }

  update(id: string, data: UpdateNotificationDto) {
    return this.prisma.notification.update({ where: { id }, data });
  }

  markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { is_read: true },
    });
  }

  delete(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
