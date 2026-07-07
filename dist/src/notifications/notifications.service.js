"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const notifications_repository_1 = require("./notifications.repository");
let NotificationsService = class NotificationsService {
    notificationsRepository;
    constructor(notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }
    async findForCustomer(customerId, query) {
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
    async findAll(query) {
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
    async findOne(id) {
        const notification = await this.notificationsRepository.findById(id);
        if (!notification) {
            throw new common_1.NotFoundException('Không tìm thấy thông báo.');
        }
        return notification;
    }
    create(dto, adminId) {
        return this.notificationsRepository.create(dto, adminId);
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.notificationsRepository.update(id, dto);
    }
    async markAsRead(id) {
        await this.findOne(id);
        return this.notificationsRepository.markAsRead(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.notificationsRepository.delete(id);
        return { message: 'Đã xóa thông báo thành công.' };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_repository_1.NotificationsRepository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map