import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { workspaceSchema } from "@/lib/validation";
import db from "@/db";
import { workspace } from "@/db/schema";

const app = new Hono()
    .post("/", zValidator("json", workspaceSchema), async (c) => {
        // add session middleware
        const user = {
            id: "234343443"
        }

        const { name } = c.req.valid("json")

        // const workspaceCreated = await db.insert(workspace).values({
        //     name
        // })


    })

export default app;