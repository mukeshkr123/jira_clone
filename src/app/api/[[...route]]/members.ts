import db from "@/db";
import { members } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
    .get("/", zValidator("query", z.object({ workspaceId: z.string() })), async (c) => {
        const { workspaceId } = c.req.valid("query");

        const results = await db.query.members.findMany({
            where: eq(members.workspaceId, workspaceId),
            with: {
                user: {
                    columns: {
                        email: true,
                        name: true
                    }
                }
            }
        })

        // populate the user TODO:
        return c.json({
            data: results
        })
    })


export default app;
