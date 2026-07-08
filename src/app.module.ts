import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { GatewayModule } from './gateway/gateway.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { ZaloPayModule } from './zalopay/zalopay.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AdminModule,
    CustomerModule,
    ProductsModule,
    OrdersModule,
    NotificationsModule,
    GatewayModule,
    VouchersModule,
    ZaloPayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
