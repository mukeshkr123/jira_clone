import { pgTable, text, varchar } from "drizzle-orm/pg-core";

export const workspace = pgTable("workspaces", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    userId: text("user_id").notNull()
})


// export type Workspace = InferModel<typeof workspace>;
// export type NewWorkspace = InferModel<typeof workspace,