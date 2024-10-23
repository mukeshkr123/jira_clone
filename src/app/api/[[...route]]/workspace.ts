import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { inviteCodeSchema, updateWorkspaceSchema, workspaceSchema } from "@/lib/validation";
import db from "@/db";
import { members, workspaces } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { generateInviteCode, INVITECODE_LENGTH } from "@/lib/utils";

export const imageUrl = "https://images.unsplash.com/photo-1720048169707-a32d6dfca0b3"

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
        console.log("zValidator");

        // add session middleware 
        const user = {
            id: "234343443"
        }

        const { name, image } = c.req.valid("form") // TODO: upload image

        const workspace = await db.insert(workspaces).values({
            name,
            userId: user.id,
            imageUrl: imageUrl
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
            imageUrl: imageUrl
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
        console.log("call reset");

        const { workspaceId } = c.req.param();
        const workspace = await db.update(workspaces).set({
            inviteCode: generateInviteCode(INVITECODE_LENGTH)
        }).where(eq(workspaces.id, workspaceId)).returning()

        return c.json({ data: workspace[0] });
    })
    .post(
        "/:workspaceId/join",
        zValidator("json", inviteCodeSchema),
        async (c) => {

            const { workspaceId } = c.req.param();
            const { code } = c.req.valid("json");

            const userId = "23232e3"

            // check if already member
            const member = await db.query.members.findFirst({
                where: (
                    and(eq(members.workspaceId, workspaceId), eq(members.userId, userId))
                )
            })

            if (member) {
                return c.json({ error: "User is already a member of this workspace" }, 403);
            }

            // cheeck workspaces exits 
            const workspace = await db.query.workspaces.findFirst({
                where: eq(workspaces.id, workspaceId)
            })

            if (workspace?.inviteCode !== code) {
                return c.json({ error: "Invalid invite code" }, 400);
            }

            await db.insert(members).values({
                workspaceId,
                userId,
                role: "MEMBER"
            })

            return c.json({ data: workspace });
        })
    .get("/:workspaceId/info", async (c) => {
        const { workspaceId } = c.req.param();

        const workspace = await db.query.workspaces.findFirst({
            where: eq(workspaces.id, workspaceId)
        })

        if (!workspace) {
            return c.json({ error: "Workspace not found" }, 404);
        }

        return c.json({
            data: {
                id: workspace.id,
                name: workspace.name,
                imageUrl: imageUrl,
            },
        });
    })


export default app;