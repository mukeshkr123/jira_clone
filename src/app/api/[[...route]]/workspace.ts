import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { inviteCodeSchema, updateWorkspaceSchema, workspaceSchema } from "@/lib/validation";
import db from "@/db";
import { members, tasks, workspaces } from "@/db/schema";
import { and, eq, gt, lt } from "drizzle-orm";
import { generateInviteCode, INVITECODE_LENGTH } from "@/lib/utils";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { verifyAuth } from "@hono/auth-js";

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
    .post("/",
        verifyAuth(),
        zValidator("form", workspaceSchema), async (c) => {

            const auth = c.get("authUser");

            if (!auth.token?.id) {
                return c.json({
                    error: "Unauthorized",
                }, 401);
            }


            const { name } = c.req.valid("form") // TODO: upload image

            const workspace = await db.insert(workspaces).values({
                name,
                userId: auth.token.id,
                imageUrl: imageUrl
            }).returning()

            await db.insert(members).values({
                workspaceId: workspace[0].id,
                userId: auth.token.id,
                role: "ADMIN"
            })

            return c.json({ data: workspace[0] })
        })
    .patch("/:workspaceId", zValidator("form", updateWorkspaceSchema), async (c) => {
        const { workspaceId } = c.req.param();
        const { name } = c.req.valid("form")

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
        await db.delete(workspaces).where(eq(workspaces.id, workspaceId))
        return c.json({ data: { id: workspaceId } });
    })
    .post("/:workspaceId/reset-invite-code", async (c) => {
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
    .get("/:workspaceId/analytics", async (c) => {
        const { workspaceId } = c.req.param();

        const userId = "58f64664-209a-4ec5-8850-5c3d8dc7d627";

        const member = await db.query.members.findFirst({
            where: and(eq(members.workspaceId, workspaceId), eq(members.userId, userId))
        });

        if (!member) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));


        // Count tasks for the current and last month
        const thisMonthTasks = await db.query.tasks.findMany({
            where: and(
                eq(tasks.workspaceId, workspaceId),
                gt(tasks.createdAt, thisMonthStart),
                lt(tasks.createdAt, thisMonthEnd)
            )
        });
        const lastMonthTasks = await db.query.tasks.findMany({
            where: and(
                eq(tasks.workspaceId, workspaceId),
                gt(tasks.createdAt, lastMonthStart),
                lt(tasks.createdAt, lastMonthEnd)
            )
        });

        const taskCount = thisMonthTasks.length;
        const taskDiff = taskCount - lastMonthTasks.length;

        // Count assigned tasks
        const thisMonthAssignedTasks = thisMonthTasks.filter(task => task.assigneeId === userId);
        const lastMonthAssignedTasks = lastMonthTasks.filter(task => task.assigneeId === userId);
        const assignedTaskCount = thisMonthAssignedTasks.length;
        const assignedTaskDiff = assignedTaskCount - lastMonthAssignedTasks.length;

        // Count incomplete tasks
        const thisMonthIncompleteTasks = thisMonthTasks.filter(task => task.status !== "DONE");
        const lastMonthIncompleteTasks = lastMonthTasks.filter(task => task.status !== "DONE");
        const incompleteTaskCount = thisMonthIncompleteTasks.length;
        const incompleteTaskDiff = incompleteTaskCount - lastMonthIncompleteTasks.length;

        // Count completed tasks
        const thisMonthCompletedTasks = thisMonthTasks.filter(task => task.status === "DONE");
        const lastMonthCompletedTasks = lastMonthTasks.filter(task => task.status === "DONE");
        const completedTaskCount = thisMonthCompletedTasks.length;
        const completeTaskDiff = completedTaskCount - lastMonthCompletedTasks.length;

        // Count overdue tasks
        const thisMonthOverdueTasks = thisMonthIncompleteTasks.filter(task => new Date(task.dueDate) < now);
        const lastMonthOverdueTasks = lastMonthIncompleteTasks.filter(task => new Date(task.dueDate) < now);
        const overdueTaskCount = thisMonthOverdueTasks.length;
        const overdueTaskDiff = overdueTaskCount - lastMonthOverdueTasks.length;

        return c.json({
            data: {
                taskCount,
                taskDiff,
                assignedTaskCount,
                assignedTaskDiff,
                incompleteTaskCount,
                incompleteTaskDiff,
                completedTaskCount,
                completeTaskDiff,
                overdueTaskCount,
                overdueTaskDiff
            }
        });

    })


export default app;