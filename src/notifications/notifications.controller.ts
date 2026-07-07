import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetNotificationsQueryDto } from './dto/get-notifications-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('api/v1')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('customer/notifications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông báo của customer kèm thông báo hệ thống',
  })
  findForCustomer(@Request() req, @Query() query: GetNotificationsQueryDto) {
    return this.notificationsService.findForCustomer(req.user.id, query);
  }

  @Patch('customer/notifications/:id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đánh dấu thông báo đã đọc' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Get('admin/notifications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy tất cả thông báo (Admin)' })
  findAll(@Query() query: GetNotificationsQueryDto) {
    return this.notificationsService.findAll(query);
  }

  @Get('admin/notifications/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chi tiết thông báo (Admin)' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Post('admin/notifications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo thông báo (Admin)' })
  create(@Body() dto: CreateNotificationDto, @Request() req) {
    return this.notificationsService.create(dto, req.user.id);
  }

  @Patch('admin/notifications/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông báo (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateNotificationDto) {
    return this.notificationsService.update(id, dto);
  }

  @Delete('admin/notifications/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa thông báo (Admin)' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
