import db from "@/db";
import { members, tasks } from "@/db/schema";
import { TaskStatus } from "@/lib/types";
import { createTaskSchema } from "@/lib/validation";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const user = {
    id: "234343443"
}

const app = new Hono()
    .post("/"
        ,
        zValidator("json", createTaskSchema),
        async (c) => {
            const {
                assigneeId,
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

            const newPostion = 1

            const newTask = await db.insert(tasks).values({
                assigneeId,
                dueDate: new Date().toISOString(),
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



export default app;