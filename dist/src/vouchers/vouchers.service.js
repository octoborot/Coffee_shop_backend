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
exports.VouchersService = void 0;
const common_1 = require("@nestjs/common");
const vouchers_repository_1 = require("./vouchers.repository");
let VouchersService = class VouchersService {
    vouchersRepository;
    constructor(vouchersRepository) {
        this.vouchersRepository = vouchersRepository;
    }
    async findActive(query) {
        return this.paginate(query, true);
    }
    async findAll(query) {
        return this.paginate(query, false);
    }
    async findOne(id) {
        const voucher = await this.vouchersRepository.findById(id);
        if (!voucher) {
            throw new common_1.NotFoundException('Không tìm thấy voucher.');
        }
        return voucher;
    }
    async findByCode(code) {
        const voucher = await this.vouchersRepository.findByCode(code);
        if (!voucher) {
            throw new common_1.NotFoundException('Không tìm thấy voucher.');
        }
        return voucher;
    }
    create(dto, adminId) {
        return this.vouchersRepository.create(dto, adminId);
    }
    async update(id, dto, adminId) {
        await this.findOne(id);
        return this.vouchersRepository.update(id, dto, adminId);
    }
    async remove(id) {
        await this.findOne(id);
        await this.vouchersRepository.delete(id);
        return { message: 'Đã xóa voucher thành công.' };
    }
    async paginate(query, activeOnly) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const result = await this.vouchersRepository.findAll({
            discount_type: query.discount_type,
            category: query.category,
            is_active: query.is_active,
            search: query.search,
            page,
            limit,
            activeOnly,
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
};
exports.VouchersService = VouchersService;
exports.VouchersService = VouchersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [vouchers_repository_1.VouchersRepository])
], VouchersService);
//# sourceMappingURL=vouchers.service.js.map