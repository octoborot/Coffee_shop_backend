import { ConfigService } from '@nestjs/config';
export declare class ZaloPayService {
    private readonly configService;
    constructor(configService: ConfigService);
    createZaloPayOrder(appTransId: string, amount: number, description: string, items: any[], embedData?: any): Promise<{
        order_url: any;
        zp_trans_token: any;
    }>;
}
