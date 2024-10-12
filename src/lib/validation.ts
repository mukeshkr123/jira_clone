import { z } from "zod";

export const workspaceSchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ]).optional(),
});
