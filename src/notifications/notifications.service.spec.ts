import { NotFoundException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repository: jest.Mocked<NotificationsRepository>;

  const notification = {
    id: 'notification-1',
    customer_id: null,
    created_by_admin_id: 'admin-1',
    title: 'Ưu đãi mới',
    description: 'Nhập mã HOTDEAL hôm nay.',
    type: NotificationType.promo,
    image: null,
    is_read: false,
    created_at: new Date('2026-07-07T10:00:00.000Z'),
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      markAsRead: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<NotificationsRepository>;

    service = new NotificationsService(repository);
  });

  it('returns customer notifications including system notifications', async () => {
    repository.findAll.mockResolvedValue({
      items: [notification],
      total: 1,
    });

    const result = await service.findForCustomer('customer-1', {
      page: 1,
      limit: 10,
    });

    expect(repository.findAll).toHaveBeenCalledWith({
      customerId: 'customer-1',
      type: undefined,
      is_read: undefined,
      page: 1,
      limit: 10,
      includeSystem: true,
    });
    expect(result).toEqual({
      data: [notification],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
  });

  it('returns admin notifications with pagination', async () => {
    repository.findAll.mockResolvedValue({
      items: [notification],
      total: 1,
    });

    const result = await service.findAll({
      type: NotificationType.promo,
      page: 2,
      limit: 5,
    });

    expect(repository.findAll).toHaveBeenCalledWith({
      type: NotificationType.promo,
      is_read: undefined,
      page: 2,
      limit: 5,
    });
    expect(result.meta).toEqual({ page: 2, limit: 5, total: 1, totalPages: 1 });
  });

  it('returns one notification', async () => {
    repository.findById.mockResolvedValue(notification);

    await expect(service.findOne('notification-1')).resolves.toEqual(
      notification,
    );
  });

  it('throws NotFoundException when notification does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates notification', async () => {
    repository.create.mockResolvedValue(notification);

    const dto = {
      title: 'Ưu đãi mới',
      description: 'Nhập mã HOTDEAL hôm nay.',
      type: NotificationType.promo,
    };

    await expect(service.create(dto, 'admin-1')).resolves.toEqual(notification);
    expect(repository.create).toHaveBeenCalledWith(dto, 'admin-1');
  });

  it('updates notification after existence check', async () => {
    repository.findById.mockResolvedValue(notification);
    repository.update.mockResolvedValue({
      ...notification,
      title: 'Updated',
    });

    const result = await service.update('notification-1', { title: 'Updated' });

    expect(repository.update).toHaveBeenCalledWith('notification-1', {
      title: 'Updated',
    });
    expect(result.title).toBe('Updated');
  });

  it('marks notification as read after existence check', async () => {
    repository.findById.mockResolvedValue(notification);
    repository.markAsRead.mockResolvedValue({
      ...notification,
      is_read: true,
    });

    const result = await service.markAsRead('notification-1');

    expect(repository.markAsRead).toHaveBeenCalledWith('notification-1');
    expect(result.is_read).toBe(true);
  });

  it('removes notification after existence check', async () => {
    repository.findById.mockResolvedValue(notification);
    repository.delete.mockResolvedValue(notification);

    await expect(service.remove('notification-1')).resolves.toEqual({
      message: 'Đã xóa thông báo thành công.',
    });
    expect(repository.delete).toHaveBeenCalledWith('notification-1');
  });
});
