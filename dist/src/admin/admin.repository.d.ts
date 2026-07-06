import { PrismaService } from '../prisma/prisma.service';
export declare class AdminRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getRevenue(from: Date, to: Date): Promise<number>;
    countOrdersByStatus(): Promise<Record<string, number>>;
    countActiveCustomers(): Promise<number>;
    getTopProducts(limit?: number): Promise<{
        name: string;
        total_sold: number;
    }[]>;
    getOrderStats(): Promise<{
        total_orders: number;
        total_revenue: number;
    }>;
}
