// Creates the first admin account and the initial Terms/Privacy policies. Safe to re-run.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "argon2";
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password || password.length < 8) {
    throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (8+ characters) in .env");
  }

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      email,
      username: "admin",
      passwordHash: await hash(password),
      role: "ADMIN",
      emailVerifiedAt: new Date(),
      onboardedAt: new Date(),
      profile: { create: { fullName: "VÔL Admin", visibility: "PRIVATE" } },
    },
  });
  console.log(`Admin account: ${admin.email}`);

  for (const type of ["TERMS", "PRIVACY"] as const) {
    await prisma.policy.upsert({
      where: { type_version: { type, version: 1 } },
      update: {},
      create: {
        type,
        version: 1,
        content: "Placeholder until the real legal text is supplied.",
        publishedAt: new Date(),
        updatedById: admin.id,
      },
    });
  }
  console.log("Policies: TERMS v1, PRIVACY v1");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
