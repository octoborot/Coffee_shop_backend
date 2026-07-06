import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Tạo tài khoản Admin mặc định
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

  // 2. Thêm dữ liệu sản phẩm mẫu (từ Frontend)
  const mockProducts = [
    {
      name: "Caramel Macchiato",
      subname: "Best Seller, Bán Chạy, Nổi bật",
      price_vnd: 45000,
      price: 45000 / 25000,
      category: "Coffee",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuABDRvhNDBYRZ283Hu6iRAnnM7kwJ0vyKLRu1LAMnv83X8-Cb0oGjglscNhhT7fUg8c_Uuf4u5RAwEqPnXmVz16OWXL8EQk74Dpt509VRmmK2l0M2k_c1FlNYaLo-37a_kxT9YHRDF-MCGIvCrCM0yBw_vBEm2bbclLXCg10Losfq1qYt5BQdnOuQntHaUHLXzBYYK-qcQBMaPTH4hjEngCKQwpRq8SxtCCdOnj5xxFDchbFwapCgZGRyiqDKxPHA3Ojv9TG-qsrK0D",
      details: "Sự hòa quyện tuyệt hảo giữa lớp bọt sữa êm dịu, sữa tươi thanh mát, cà phê Espresso đậm đà và sốt caramel ngọt ngào rưới đều phía trên."
    },
    {
      name: "Cold Brew Hibiscus",
      subname: "Fresh, Trà Hoa quả",
      price_vnd: 39000,
      price: 39000 / 25000,
      category: "Tea",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmXw3wgRuP9vywdkyWVgIOhiNaxJAEheKLlKdV4O_jUbR66FZ8mMVZrVGTMl6PxbAVebntcmnzucEAQQoECVCTqDfR1RBoc6t8P_ptxzwfuNbScNrvrXyoOoZ7d1MZtV0VB2Zssha2tc1kKYd7ET2c7b5fLU2QxEC0wn_4_xZMk5HwrqD1XrRvOuxi2Oux9OexCksEtHEvJWkcyWMbAR2dI0VCj5ZbpXHadX40iWXIgXedbaLbbexfmKfmKzqZ4vTp9ixtDuxtyglZ",
      details: "Cà phê Cold Brew ủ lạnh 16 tiếng sảng khoái kết hợp tuyệt diệu cùng trà hoa hồng Hibiscus thanh mát, điểm xuyết một chút lát chanh tươi và lá bạc hà mát lạnh."
    },
    {
      name: "Oatmilk Matcha",
      subname: "Organic, Healthy",
      price_vnd: 55000,
      price: 55000 / 25000,
      category: "Tea",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4U2n0hr74fh2LXeBACj7pb_bleV3OlHX3nlwkHtXwWP5xYsqBInogXXF7cqKm6Mj8TJHRUdO5a7RkAjLxEMwuOS8_YDgxBSXnJz4UBI2uVRjpr9imH15phCtaiAbXDvNZYgi0_IbncakcRnzCRncW2HmswYgPmTFndTlfAE_WLwf5GaB5T9P6p5IB3sv8SbUheOw84TFzhZPNOJfwJTGr0CKaIFkr_P6mUbIaIMBiZW--LzZdvhDX81K5ecDlvR4V7YfPse5eCK_3",
      details: "Bột matcha thượng hạng nhập khẩu trực tiếp từ Shizuoka, Nhật Bản, được đánh tay bông mịn, kết hợp với dòng sữa yến mạch thơm ngậy, giàu dưỡng chất tốt cho sức khỏe."
    },
    {
      name: "Butter Croissant",
      subname: "Warm, Freshly Baked",
      price_vnd: 28000,
      price: 28000 / 25000,
      category: "Pastry",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDw4u_-Dh_kq2FdvqrySLDx2SjQyLBOLZQ2j0ENGfdvEXcFgNu491U3riSjkXNhfA4LaK3cwJqux_rtpzhKclfcJ3AKiYI6ysogSxJnaiziopMmtejdLmmBbkOOjZKaFZaPI5_hHCq_jXyrSfdgULJ05OsNlupAzCitdbYCJ84JOy5Avboftt2r0BiBS6q3dcaf56EtR6Vt7hzpRKOm8SH1JMX3dpSsQpMr9_xEjSQ6HjWLzAe7Ii_YMllXOOAajrsgWYBYZGtD3q8T",
      details: "Bánh sừng bò truyền thống kiểu Pháp với từng lớp bột ngàn lớp thơm nức mùi bơ lạt nguyên chất, rắc hạt hạnh nhân lát mỏng vàng giòn rụm."
    },
    {
      name: "Cà phê Sữa Đá Brew",
      subname: "Truyền Thống, Đậm Vị",
      price_vnd: 29000,
      price: 29000 / 25000,
      category: "Coffee",
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=400",
      details: "Cà phê Robusta Đắk Lắk rang mộc đậm vị phin truyền thống, kết hợp hòa quyện với sữa đặc sánh ngọt mượt mà tạo nên ly cà phê sữa đá kinh điển của Việt Nam."
    },
    {
      name: "Espresso Romano Chanh",
      subname: "Refreshing",
      price_vnd: 35000,
      price: 35000 / 25000,
      category: "Coffee",
      image: "https://images.unsplash.com/photo-1510972527409-cef190317417?auto=format&fit=crop&q=80&w=400",
      details: "Một ly Espresso đậm đà mát lạnh hòa quyện cùng cốt chanh tươi sảng khoái và một thìa mật ong rừng ngọt thanh, khơi dậy năng lượng tức thì."
    },
    {
      name: "Trà Đào Hồng Đài",
      subname: "Fruity, Best Seller",
      price_vnd: 45000,
      price: 45000 / 25000,
      category: "Tea",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400",
      details: "Cốt trà lài thanh tao ướp hương dịu mát, lắc cùng mứt đào tươi nguyên miếng ngọt giòn, dâu tây đỏ mọng sấy thăng hoa tạo nên sắc hồng thu hút."
    },
    {
      name: "Nước Ép Cam Nha Đam",
      subname: "100% Fresh, Healthy",
      price_vnd: 35000,
      price: 35000 / 25000,
      category: "Juice",
      image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400",
      details: "Nước ép cam sành tươi mọng nước 100% nguyên chất, dồi dào Vitamin C giúp tăng đề kháng kết hợp topping hạt nha đam giòn sật ngọt nhẹ vui miệng."
    },
    {
      name: "Dưa Hấu Bạc Hà Cooler",
      subname: "Fresh, Summer Special",
      price_vnd: 32000,
      price: 32000 / 25000,
      category: "Juice",
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=400",
      details: "Dưa hấu Long An ngọt lịm ép lạnh, pha chế tinh tế cùng một vài lá bạc hà vò nát giải nhiệt hoàn hảo cho những ngày hè nắng nóng."
    },
    {
      name: "Matcha Tiramisu Card",
      subname: "Dessert, Sweet Treats",
      price_vnd: 39000,
      price: 39000 / 25000,
      category: "Pastry",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=400",
      details: "Lớp kem phô mai mascarpone béo ngậy mềm mịn hòa quyện hoàn hảo với từng thớ bánh quy ladyfinger thấm đẫm cốt rượu nhẹ hương thảo mộc và phủ bột matcha tươi mát."
    }
  ];

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    console.log('⏳ Đang tạo dữ liệu sản phẩm mẫu...');
    for (const p of mockProducts) {
      await prisma.product.create({
        // @ts-ignore
        data: p,
      });
    }
    console.log(`✅ Đã tạo thành công ${mockProducts.length} sản phẩm mẫu!`);
  } else {
    console.log(`ℹ️  Đã có sẵn ${productCount} sản phẩm trong database, bỏ qua bước tạo sản phẩm.`);
  }
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
