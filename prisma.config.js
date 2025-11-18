import dotenv from "dotenv";
import path from "path";
import { defineConfig, env } from "prisma/config";
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });
console.log("Loaded .env from:", envPath);
console.log("DATABASE_URL =", process.env.DATABASE_URL);
export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    engine: "classic",
    datasource: {
        url: env("DATABASE_URL"),
    },
});
//# sourceMappingURL=prisma.config.js.map