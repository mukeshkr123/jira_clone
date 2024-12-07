import db from "@/db";
import { projects, tasks } from "@/db/schema";
import { createProjectSchema, updateProjectSchema } from "@/lib/validation";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { and, eq, gt, lt } from "drizzle-orm";
import { Hono } from "hono";

export const imageUrl = "https://images.unsplash.com/photo-1720048169707-a32d6dfca0b3";

const app = new Hono()
    .get("/", async (c) => {
        const allProjects = await db.query.projects.findMany();
        return c.json({ data: allProjects });
    })
    .get("/:projectId", async (c) => {
        const { projectId } = c.req.param();

        const project = await db.query.projects.findFirst({
            where: eq(projects.id, projectId),
        });

        if (!project) {
            return c.json({ error: "Project not found" }, 404);
        }

        return c.json({ data: project });
    })
    .post("/", zValidator("form", createProjectSchema), async (c) => {
        const { name, workspaceId } = c.req.valid("form");

        const project = await db.insert(projects).values({
            workspaceId: workspaceId,
            name,
            image: imageUrl,
        }).returning();

        return c.json({ data: project[0] });
    })
    .patch("/:projectId", zValidator("form", updateProjectSchema), async (c) => {
        const { projectId } = c.req.param();
        const { name } = c.req.valid("form");

        const existingProject = await db.query.projects.findFirst({
            where: eq(projects.id, projectId),
        });

        if (!existingProject) {
            return c.json({ error: "Project not found" }, 404);
        }

        const updatedProject = await db.update(projects)
            .set({
                name,
                image: imageUrl,
            })
            .where(eq(projects.id, projectId))
            .returning();

        return c.json({ data: updatedProject[0] });
    })
    .delete("/:projectId", async (c) => {
        const { projectId } = c.req.param();

        const existingProject = await db.query.projects.findFirst({
            where: eq(projects.id, projectId),
        });

        if (!existingProject) {
            return c.json({ error: "Project not found" }, 404);
        }

        const result = await db.delete(projects).where(eq(projects.id, projectId)).returning();

        return c.json({ data: result[0] });
    }).get("/:projectId/analytics", verifyAuth(), async (c) => {
        const { projectId } = c.req.param();

        const auth = c.get("authUser")

        if (!auth.token?.id) {
            return c.json({
                error: "Unauthorized",
            }, 401);
        }

        const userId = auth.token.id;

        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));

        const thisMonthTasks = await db.query.tasks.findMany({
            where: and(
                eq(tasks.projectId, projectId),
                gt(tasks.createdAt, thisMonthStart),
                lt(tasks.createdAt, thisMonthEnd)
            )
        });

        const lastMonthTasks = await db.query.tasks.findMany({
            where: and(
                eq(tasks.projectId, projectId),
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
