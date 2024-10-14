import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { workspaceSchema } from "@/lib/validation";
import db from "@/db";
import { members, workspaces } from "@/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono()
    .get("/", async (c) => {
        const results = await db.query.workspaces.findMany()

        return c.json({ data: results })
    })
    .post("/", zValidator("form", workspaceSchema), async (c) => {
        // add session middleware 
        const user = {
            id: "234343443"
        }

        const { name, image } = c.req.valid("form") // TODO: upload image

        const workspace = await db.insert(workspaces).values({
            name,
            userId: user.id
        }).returning()

        await db.insert(members).values({
            workspaceId: workspace[0].id,
            userId: user.id,
            role: "ADMIN"
        })

        return c.json({ data: workspace[0] })
    })

export default app;