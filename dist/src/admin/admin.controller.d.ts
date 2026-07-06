import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        revenue: {
            today: number;
            this_week: number;
            this_month: number;
        };
        orders: {
            total: number;
            by_status: Record<string, number>;
        };
        customers: {
            active_last_30_days: number;
        };
        top_products: {
            name: string;
            total_sold: number;
        }[];
        total_revenue: number;
    }>;
}
