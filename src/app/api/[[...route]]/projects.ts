import db from "@/db";
import { projects } from "@/db/schema";
import { createProjectSchema } from "@/lib/validation";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
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
        const { name, image, workspaceId } = c.req.valid("form");

        const project = await db.insert(projects).values({
            workspaceId: workspaceId,
            name,
            image: imageUrl,
        }).returning();

        return c.json({ data: project[0] });
    });

export default app;
