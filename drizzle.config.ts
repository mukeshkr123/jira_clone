import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv"

dotenv.config({
    path: ".env.local"
})

const dbUrl = process.env.DATABASE_URL!

console.log("url" + dbUrl);


export default defineConfig({
    schema: "./src/db/schema/index.ts",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: dbUrl,
    },
    verbose: true,
    strict: true,
});