import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/orders',
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('OrdersGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Orders client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Orders client disconnected: ${client.id}`);
  }

  /**
   * Được gọi từ OrdersService khi có đơn hàng mới.
   * Broadcast đến toàn bộ client Admin đang kết nối.
   */
  emitNewOrder(order: any) {
    this.server.emit('new-order', order);
    this.logger.log(`Emitted new-order: ${order.id}`);
  }

  emitOrderUpdated(order: any) {
    this.server.emit('order-updated', order);
    this.logger.log(`Emitted order-updated: ${order.id}`);
  }
}
