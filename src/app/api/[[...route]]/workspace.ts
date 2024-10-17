import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { updateWorkspaceSchema, workspaceSchema } from "@/lib/validation";
import db from "@/db";
import { members, workspaces } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateInviteCode, INVITECODE_LENGTH } from "@/lib/utils";

const app = new Hono()
    .get("/", async (c) => {
        const results = await db.query.workspaces.findMany()

        return c.json({ data: results })
    })
    .get("/:workspaceId", async (c) => {
        const { workspaceId } = c.req.param();

        const workspace = await db.query.workspaces.findFirst({
            where: eq(workspaces.id, workspaceId)
        })

        return c.json({ data: workspace });
    })
    .post("/", zValidator("form", workspaceSchema), async (c) => {
        // add session middleware 
        const user = {
            id: "234343443"
        }

        const { name, image } = c.req.valid("form") // TODO: upload image

        const workspace = await db.insert(workspaces).values({
            name,
            userId: user.id,
            imageUrl: "https://"
        }).returning()

        await db.insert(members).values({
            workspaceId: workspace[0].id,
            userId: user.id,
            role: "ADMIN"
        })

        return c.json({ data: workspace[0] })
    })
    .patch("/:workspaceId", zValidator("form", updateWorkspaceSchema), async (c) => {
        const { workspaceId } = c.req.param();
        const { name, image } = c.req.valid("form")

        // check this person is exists and admin

        const updatedWorkspace = await db.update(workspaces).set({
            name,
            imageUrl: image ? "https://" : undefined
        }).where(eq(workspaces.id, workspaceId)).returning()

        // if (!updatedWorkspace) {
        //     return c.json({ error: "Workspace not found" }, { status: 404 })
        // }

        return c.json({
            data: updatedWorkspace[0]
        }, {
            status: 200
        })

    })
    .delete("/:workspaceId", async (c) => {
        const { workspaceId } = c.req.param();
        const workspace = await db.delete(workspaces).where(eq(workspaces.id, workspaceId))
        return c.json({ data: { $id: workspaceId } });
    })
    .post("/:workspaceId/reset-invite-code", async (c) => {
        const { workspaceId } = c.req.param();
        const workspace = await db.update(workspaces).set({
            inviteCode: generateInviteCode(INVITECODE_LENGTH)
        }).where(eq(workspaces.id, workspaceId)).returning()

        return c.json({ data: workspace[0] });
    })

export default app;