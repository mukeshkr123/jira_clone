import db from "@/db";
import { projects } from "@/db/schema";
import { createProjectSchema, updateProjectSchema } from "@/lib/validation";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

export const imageUrl = "https://images.unsplash.com/photo-1720048169707-a32d6dfca0b3";

const app = new Hono()
    .get("/", async (c) => {
        const allProjects = await db.query.projects.findMany();
        console.log("allProjects", allProjects);

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
    })
    .patch("/:projectId", zValidator("form", updateProjectSchema), async (c) => {
        const { projectId } = c.req.param();
        const { name, image } = c.req.valid("form");

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
    });

export default app;
