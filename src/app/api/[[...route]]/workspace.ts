import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { workspaceSchema } from "@/lib/validation";
import db from "@/db";
import { workspaces } from "@/db/schema";

const app = new Hono()
    .post("/", zValidator("json", workspaceSchema), async (c) => {
        // add session middleware 
        const user = {
            id: "234343443"
        }

        const { name } = c.req.valid("json")

        const workspace = await db.insert(workspaces).values({
            name,
            userId: user.id
        }).returning()

        return c.json({ data: workspace[0] })
    })

export default app;