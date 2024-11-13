import db from "@/db";
import { members } from "@/db/schema";
import { MemberRole } from "@/features/members/types";
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
                        name: true,
                        image: true
                    }
                }
            }
        });

        return c.json({
            data: results
        });
    })
    .delete("/:memberId", async (c) => {
        const { memberId } = c.req.param();
        const result = await db.delete(members).where(
            eq(members.id, memberId)
        ).returning();

        if (!result) {
            return c.json({ error: "Member not found" }, 404);
        }

        return c.json({ data: result });
    })
    .patch("/:memberId", zValidator("json", z.object({
        role: z.nativeEnum(MemberRole)
    })), async (c) => {
        const { memberId } = c.req.param();
        const data = c.req.valid("json");

        const updatedMember = await db.update(members)
            .set(data)
            .where(eq(members.id, memberId))
            .returning();

        if (!updatedMember) {
            return c.json({ error: "Member not found" }, 404);
        }

        return c.json({ data: updatedMember });
    });

export default app;
