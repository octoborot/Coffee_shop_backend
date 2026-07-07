import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetNotificationsQueryDto } from './dto/get-notifications-query.dto';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async findForCustomer(customerId: string, query: GetNotificationsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const result = await this.notificationsRepository.findAll({
      customerId,
      type: query.type,
      is_read: query.is_read,
      page,
      limit,
      includeSystem: true,
    });

    return {
      data: result.items,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }

  async findAll(query: GetNotificationsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const result = await this.notificationsRepository.findAll({
      type: query.type,
      is_read: query.is_read,
      page,
      limit,
    });

    return {
      data: result.items,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }

  async findOne(id: string) {
    const notification = await this.notificationsRepository.findById(id);
    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo.');
    }
    return notification;
  }

  create(dto: CreateNotificationDto, adminId?: string) {
    return this.notificationsRepository.create(dto, adminId);
  }

  async update(id: string, dto: UpdateNotificationDto) {
    await this.findOne(id);
    return this.notificationsRepository.update(id, dto);
  }

  async markAsRead(id: string) {
    await this.findOne(id);
    return this.notificationsRepository.markAsRead(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.notificationsRepository.delete(id);
    return { message: 'Đã xóa thông báo thành công.' };
  }
}
