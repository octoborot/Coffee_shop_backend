import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@Controller('api/v1')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ─── Customer Routes (cần đăng nhập) ────────────────────────────────────────

  @Post('customer/orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo đơn hàng mới (Customer đã đăng nhập)' })
  createOrder(@Body() dto: CreateOrderDto, @Request() req) {
    return this.ordersService.createOrder(dto, req.user.id);
  }

  @Post('orders')
  @ApiOperation({ summary: 'Tạo đơn hàng không cần đăng nhập (Guest)' })
  createGuestOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get('customer/orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy lịch sử đơn hàng của Customer' })
  getOrderHistory(@Request() req) {
    return this.ordersService.getOrderHistory(req.user.id);
  }

  @Get('customer/orders/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chi tiết 1 đơn hàng' })
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  // ─── Admin Routes ────────────────────────────────────────────────────────────

  @Get('admin/orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy tất cả đơn hàng (Admin)' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  getAdminOrders(@Query('status') status?: OrderStatus) {
    return this.ordersService.getAdminOrders(status);
  }

  @Patch('admin/orders/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng (Admin)' })
  updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto);
  }
}
