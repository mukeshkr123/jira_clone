import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";
import * as schema from "./schema";

config({ path: ".env.local" });

export const connection = postgres(process.env.DATABASE_URL as string);

export const db = drizzle(connection, {
    schema,
    logger: true,
});

export type db = typeof db;

export default db;