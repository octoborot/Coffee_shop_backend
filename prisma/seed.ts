import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Tạo tài khoản Admin mặc định (nếu chưa có)
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.create({
      data: {
        username: 'admin',
        password_hash: passwordHash,
        role: 'ADMIN',
      },
    });
    console.log('✅ Đã tạo tài khoản Admin mặc định: admin / admin123');
  } else {
    console.log('ℹ️  Tài khoản Admin đã tồn tại, bỏ qua.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
