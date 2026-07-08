import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { GatewayModule } from '../gateway/gateway.module';
import { ZaloPayModule } from '../zalopay/zalopay.module';

@Module({
  imports: [GatewayModule, ZaloPayModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
