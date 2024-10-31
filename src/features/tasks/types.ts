import { TaskStatus } from "@/lib/types";

export type Task = {
    id: string;
    name: string;
    status: string; // TODO:
    assigneeId: string;
    workspaceId: string;
    projectId: string;
    position: number;
    dueDate: string;
    description?: string | null | undefined;
    project: {
        id: string;
        name: string;
        image: string | null;
    }
};
