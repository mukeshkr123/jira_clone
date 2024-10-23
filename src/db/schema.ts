import { generateInviteCode } from "@/lib/utils";
import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("role", ["ADMIN", "MEMBER"]);

export const workspaces = pgTable("workspaces", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    userId: text("user_id").notNull(),
    imageUrl: text("image_url"),
    inviteCode: text("invite_code").$defaultFn(() => generateInviteCode(10))
})

export const members = pgTable("members", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id"),
    workspaceId: text("workspace_id"),
    role: rolesEnum().default("MEMBER")
})

export const projects = pgTable("projects", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    workspaceId: text("workspace_id").notNull(),
    image: text("image")
})