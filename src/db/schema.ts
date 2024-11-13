import { generateInviteCode } from "@/lib/utils";
import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters"


export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    password: text("password"),
});

export const usersRelations = relations(users, ({ many }) => ({
    members: many(members),
}));

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
)

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => ({
        compositePK: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
        }),
    })
)

export const rolesEnum = pgEnum("role", ["ADMIN", "MEMBER"]);

export const workspaces = pgTable("workspaces", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    imageUrl: text("image_url"),
    inviteCode: text("invite_code").$defaultFn(() => generateInviteCode(10)),
});

export const workspaceRelations = relations(workspaces, ({ many, one }) => ({
    members: many(members),
    projects: many(projects),
    user: one(users, {
        fields: [workspaces.userId],
        references: [users.id],
    })
}));

export const members = pgTable("members", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id"),
    workspaceId: text("workspace_id").references(() => workspaces.id, {
        onDelete: "cascade",
    }),
    role: rolesEnum().default("MEMBER"),
});

export const memberRelations = relations(members, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [members.workspaceId],
        references: [workspaces.id],
    }),
    user: one(users, {
        fields: [members.userId],
        references: [users.id],
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
    image: text("image"),
});

export const projectRelations = relations(projects, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [projects.workspaceId],
        references: [workspaces.id],
    }),
}));

export const tasks = pgTable("tasks", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    status: text("status").notNull(), // TODO: create enum for status
    assigneeId: text("assignee_id").notNull().references(() => users.id),
    workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
    projectId: text("project_id").notNull().references(() => projects.id),
    position: integer("position").notNull(),
    dueDate: text("due_date").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow()
})

export const taskRelation = relations(tasks, ({ one }) => (
    {
        workspace: one(workspaces, {
            fields: [tasks.workspaceId],
            references: [workspaces.id],
        }),
        project: one(projects, {
            fields: [tasks.projectId],
            references: [projects.id],
        }),
        assignee: one(users, {
            fields: [tasks.assigneeId],
            references: [users.id],
        })
    }
))