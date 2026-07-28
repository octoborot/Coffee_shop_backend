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
  Req,
  Res,
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
import type { Request as ExpressRequest, Response } from 'express';

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

  @Post('customer/orders/:id/checkout-sdk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Zalo Checkout SDK payload for Mini App' })
  createCheckoutSdkPayload(@Param('id') id: string, @Request() req) {
    return this.ordersService.createCheckoutSdkPayload(id, req.user.id);
  }

  @Post('customer/orders/:id/vnpay/payment-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create VNPAY Sandbox payment URL' })
  createVnpayPaymentUrl(
    @Param('id') id: string,
    @Request() req,
    @Req() expressReq: ExpressRequest,
  ) {
    const forwardedFor = expressReq.headers['x-forwarded-for'];
    const ipAddress = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(',')[0] || expressReq.ip;
    return this.ordersService.createVnpayPaymentUrl(
      id,
      req.user.id,
      ipAddress,
    );
  }

  @Get('vnpay/return')
  @ApiOperation({ summary: 'Receive browser return from VNPAY Sandbox' })
  async handleVnpayReturn(
    @Query() query: Record<string, string | string[] | undefined>,
    @Res() res: Response,
  ) {
    try {
      const result = await this.ordersService.handleVnpayReturn(query);
      const title = result.success
        ? 'Thanh toán VNPAY thành công'
        : 'Thanh toán VNPAY chưa thành công';
      const message = result.success
        ? `Đơn ${result.order.id} đã được ghi nhận thanh toán.`
        : `Đơn ${result.order.id} chưa được thanh toán. Bạn có thể quay lại app và chọn phương thức khác.`;
      return res.type('html').send(this.renderVnpayResultPage(title, message));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Không thể xác nhận VNPAY.';
      return res
        .status(400)
        .type('html')
        .send(this.renderVnpayResultPage('Không thể xác nhận VNPAY', message));
    }
  }

  @Get('vnpay/ipn')
  @ApiOperation({ summary: 'Receive IPN from VNPAY Sandbox' })
  async handleVnpayIpn(
    @Query() query: Record<string, string | string[] | undefined>,
  ) {
    try {
      const result = await this.ordersService.handleVnpayReturn(query);
      return {
        RspCode: result.success ? '00' : '02',
        Message: result.success ? 'Confirm Success' : 'Order not success',
      };
    } catch (error) {
      return {
        RspCode: '97',
        Message: error instanceof Error ? error.message : 'Invalid signature',
      };
    }
  }

  @Post('checkout-sdk/callback')
  @ApiOperation({ summary: 'Receive payment callback from Zalo Checkout SDK' })
  async handleCheckoutSdkCallback(
    @Body()
    body: {
      data: Record<string, unknown>;
      mac?: string;
      overallMac?: string;
    },
  ) {
    try {
      await this.ordersService.handleCheckoutSdkCallback(body);
      return { returnCode: 1, returnMessage: 'success' };
    } catch (error) {
      return {
        returnCode: 0,
        returnMessage:
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

  private renderVnpayResultPage(title: string, message: string) {
    return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: Arial, sans-serif; background: #fbf9f1; color: #442a22; }
      main { width: min(420px, calc(100vw - 32px)); padding: 24px; border-radius: 18px; background: #fff; box-shadow: 0 12px 36px rgba(68, 42, 34, .12); text-align: center; }
      h1 { margin: 0 0 10px; font-size: 22px; }
      p { margin: 0; color: #504441; line-height: 1.5; }
    </style>
  </head>
  <body>
    <main>
      <h1>${title}</h1>
      <p>${message}</p>
    </main>
  </body>
</html>`;
  }
}
