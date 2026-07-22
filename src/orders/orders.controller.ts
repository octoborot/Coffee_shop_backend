import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
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
import { UpdateOrderPaymentStatusDto } from './dto/update-order-payment-status.dto';
import { RejectOrderDto } from './dto/reject-order.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
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

  @Post('zalopay/callback')
  @ApiOperation({ summary: 'Nhận callback thanh toán thành công từ ZaloPay' })
  async handleZaloPayCallback(@Body() body: { data: string; mac: string }) {
    try {
      await this.ordersService.handleZaloPayCallback(body.data, body.mac);
      return { return_code: 1, return_message: 'success' };
    } catch (error) {
      return {
        return_code: 0,
        return_message:
          error instanceof Error ? error.message : 'callback failed',
      };
    }
  }

  @Post('bank-transfer/webhook')
  @ApiOperation({
    summary:
      'Webhook xác nhận chuyển khoản/QR từ nhà cung cấp như Casso, PayOS hoặc banking webhook',
  })
  async handleBankTransferWebhook(
    @Body() body: Record<string, unknown>,
    @Headers('x-webhook-secret') webhookSecret?: string,
  ) {
    await this.ordersService.handleBankTransferWebhook(body, webhookSecret);
    return { ok: true };
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

  @Patch('customer/orders/:id/payment-method')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Khach chon phuong thuc thanh toan sau khi quan nhan don' })
  updateCustomerPaymentMethod(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentMethodDto,
    @Request() req,
  ) {
    return this.ordersService.updateCustomerPaymentMethod(id, req.user.id, dto);
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

  @Get('admin/orders/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chi tiết 1 đơn hàng (Admin)' })
  getAdminOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
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

  @Patch('admin/orders/:id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tu choi don hang va gui ly do cho khach' })
  rejectOrder(@Param('id') id: string, @Body() dto: RejectOrderDto) {
    return this.ordersService.rejectOrder(id, dto);
  }

  @Patch('admin/orders/:id/payment-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật trạng thái thanh toán đơn hàng (Admin)' })
  updateOrderPaymentStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderPaymentStatusDto,
  ) {
    return this.ordersService.updateOrderPaymentStatus(id, dto);
  }
}
