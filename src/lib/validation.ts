import { z } from "zod";
import { TaskStatus } from "./types";

export const workspaceSchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ]).optional(),
});

export const updateWorkspaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "Must be 1 or more characters long" })
        .optional(),
    image: z
        .union([
            z.instanceof(File),
            z.string().transform((value) => (value === "" ? undefined : value)),
        ])
        .optional(),
});

export const inviteCodeSchema = z.object({ code: z.string() });

export type CreateWorkspaceSchema = z.infer<typeof workspaceSchema>;
export type UpdateWorkspaceSchema = z.infer<typeof updateWorkspaceSchema>;


export const createProjectSchema = z.object({
    name: z.string().trim().min(1, { message: "Required" }),
    image: z
        .union([
            z.instanceof(File),
            z.string().transform((value) => (value === "" ? undefined : value)),
        ])
        .optional(),

    workspaceId: z.string(),
});


export const updateProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "Minimum 1 character required" })
        .optional(),
    image: z
        .union([
            z.instanceof(File),
            z.string().transform((value) => (value === "" ? undefined : value)),
        ])
        .optional(),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;


export const createTaskSchema = z.object({
    name: z.string().trim().min(1, { message: "Required" }),
    status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
    workspaceId: z.string().trim().min(1, { message: "Required" }),
    projectId: z.string().trim().min(1, { message: "Required" }),
    assigneeId: z.string().trim().min(1, { message: "Required" }),
    dueDate: z.coerce.date(),
    description: z.string().optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

