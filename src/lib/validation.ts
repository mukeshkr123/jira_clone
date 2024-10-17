import { z } from "zod";

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