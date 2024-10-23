import { generateInviteCode } from "@/lib/utils";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("role", ["ADMIN", "MEMBER"]);

export const workspaces = pgTable("workspaces", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    userId: text("user_id").notNull(),
    imageUrl: text("image_url"),
    inviteCode: text("invite_code").$defaultFn(() => generateInviteCode(10)), // Ensure generateInviteCode is synchronous
});

export const workspaceRelations = relations(workspaces, ({ many }) => ({
    members: many(members),
    projects: many(projects),
}));

export const members = pgTable("members", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id"),
    workspaceId: text("workspace_id").references(() => workspaces.id, {
        onDelete: "cascade", // Ensure cascading works properly
    }),
    role: rolesEnum().default("MEMBER"), // Check default method for enum
});

export const memberRelations = relations(members, ({ many, one }) => ({
    workspace: one(workspaces, {
        fields: [members.workspaceId],
        references: [workspaces.id],
    }),
}));

export const projects = pgTable("projects", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    workspaceId: text("workspace_id").references(() => workspaces.id, {
        onDelete: "cascade",
    }),
    image: text("image"), // Optionally validate URL format in the app logic
});

export const projectRelations = relations(projects, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [projects.workspaceId],
        references: [workspaces.id],
    }),
}));
