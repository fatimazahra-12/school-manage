import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const roles = ["Admin", "Teacher", "Student"];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { id: 0 }, // dummy value; see below
      update: {},
      create: {
        nom: r,
      },
    });
  }

  console.log("🌱 Seed successful!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
