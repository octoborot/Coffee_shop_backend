import { AdminRepository } from './admin.repository';
export declare class AdminService {
    private readonly adminRepository;
    constructor(adminRepository: AdminRepository);
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
