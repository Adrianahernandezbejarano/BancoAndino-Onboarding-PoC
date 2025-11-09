import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const passwordHash = await bcrypt.hash('Test1234!', 10);

  const testUsers = [
    {
      email: 'test1@bancoandino.com',
      telefono: '+571234567890',
      passwordHash,
      emailVerificado: true,
    },
    {
      email: 'test2@bancoandino.com',
      telefono: '+571234567891',
      passwordHash,
      emailVerificado: false,
    },
  ];

  for (const user of testUsers) {
    await prisma.cliente.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
