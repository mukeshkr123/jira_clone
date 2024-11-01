import db from "@/db";
import { tasks } from "@/db/schema";
import { TaskStatus } from "@/lib/types";
import { createTaskSchema } from "@/lib/validation";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
    .delete("/:taskId", async (c) => {
        const { taskId } = c.req.param();


        await db.delete(tasks).where(eq(tasks.id, taskId));

        return c.json({
            data: {
                id: taskId
            }
        })
    })
    .post("/"
        ,
        zValidator("json", createTaskSchema),
        async (c) => {
            const {
                // assigneeId,
                dueDate,
                description,
                name,
                projectId,
                status,
                workspaceId
            } = c.req.valid("json")

            //  TODO: add check later
            // const member = await db.query.members.findFirst({
            //     where: and(eq(members.workspaceId, projectId), eq(members.userId, user.id)),
            // })

            // if (!member) {
            //     return c.json({ error: "Unauthorized" }, 401);
            // }
            // add session middleware 
            const userId = "58f64664-209a-4ec5-8850-5c3d8dc7d627"
            const newPostion = 1

            const newTask = await db.insert(tasks).values({
                assigneeId: userId,
                dueDate: new Date(dueDate).toISOString(),
                description,
                name,
                projectId,
                status,
                position: newPostion,
                workspaceId: workspaceId,

            })

            return c.json({ data: newTask })
        }
    ).get("/",
        zValidator(
            "query",
            z.object({
                workspaceId: z.string(),
                projectId: z.string().nullish(),
                assigneeId: z.string().nullish(),
                search: z.string().nullish(),
                dueDate: z.string().nullish(),
                status: z.nativeEnum(TaskStatus).nullish(),
            })
        ),
        async (c) => {

            const tasks = await db.query.tasks.findMany({
                with: {
                    project: {
                        columns: {
                            id: true,
                            name: true,
                            image: true,
                        }
                    },
                    assignee: {
                        columns: {
                            id: true,
                            name: true,
                            image: true,
                        }
                    }
                }
            })

            return c.json({ data: tasks })

        }).post("/bulk-update", zValidator(
            "json",
            z.object({
                updatedTasks: z.array(
                    z.object({
                        id: z.string(),
                        status: z.nativeEnum(TaskStatus),
                        position: z.number().int().positive().min(1000).max(1_000_000),
                    })
                ),
            })
        ), async (c) => {
            const { updatedTasks } = c.req.valid("json");

            const results = await Promise.all(
                updatedTasks.map(task =>
                    db.update(tasks)
                        .set({
                            status: task.status,
                            position: task.position,
                        })
                        .where(eq(tasks.id, task.id))
                        .returning()
                )
            );

            return c.json({ data: results });
        })
    .get("/:taskId", async (c) => {

        const { taskId } = c.req.param();
        const result = await db.query.tasks.findFirst({
            where: eq(tasks.id, taskId),
            with: {
                project: {
                    columns: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                assignee: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        })

        if (!result) {
            return c.json({ error: "Task not found" }, 404);
        }

        return c.json({
            data: result,
        }, 200);
    })
    .patch("/:taskId",
        zValidator("json", createTaskSchema.partial()),
        async (c) => {
            const {
                name,
                status,
                dueDate,
                projectId,
                assigneeId,
                description,
            } = c.req.valid("json");
            const { taskId } = c.req.param();

            const updatedTask = await db.update(tasks)
                .set({
                    name,
                    status,
                    dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
                    projectId,
                    assigneeId,
                    description,
                })
                .where(eq(tasks.id, taskId))
                .returning();

            if (!updatedTask) {
                return c.json({ error: "Task not found" }, 404);
            }

            return c.json({ data: updatedTask[0] });
        }
    );

export default app;