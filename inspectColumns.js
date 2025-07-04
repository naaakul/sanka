const { PrismaClient } = require("@prisma/client");

async function run() {
  const prisma = new PrismaClient();
  try {
    const columns = await prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'account';
    `;
    console.log("Columns on account table:");
    console.table(columns.map(row => row.column_name));
  } catch (e) {
    console.error("Error querying columns:", e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
