import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class ZaloPayService {
  constructor(private readonly configService: ConfigService) {}

  async createZaloPayOrder(
    appTransId: string, // e.g. 210824_123456
    amount: number,
    description: string,
    items: any[],
    embedData: any = {},
  ) {
    const appId = this.configService.get<string>('ZALOPAY_APP_ID') || '2553';
    const key1 = this.configService.get<string>('ZALOPAY_KEY1') || 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL';
    const endpoint =
      this.configService.get<string>('ZALOPAY_ENDPOINT') ||
      'https://sb-openapi.zalopay.vn/v2/create';

    const order = {
      app_id: appId,
      app_trans_id: appTransId, // Format: yyMMdd_id
      app_user: 'Customer',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embedData),
      amount: amount,
      description: description,
      bank_code: '',
      mac: '',
    };

    // mac = HMAC_SHA256(mac_key, app_id|app_trans_id|app_user|amount|app_time|embed_data|item)
    const data =
      order.app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;

    order.mac = crypto.createHmac('sha256', key1).update(data).digest('hex');

    try {
      const response = await axios.post(endpoint, null, { params: order });
      if (response.data.return_code === 1) {
        return {
          order_url: response.data.order_url,
          zp_trans_token: response.data.zp_trans_token,
        };
      } else {
        throw new BadRequestException(
          `Lỗi ZaloPay: ${response.data.return_message}`,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Không thể gọi API ZaloPay Sandbox.');
    }
  }
}
