// import { TaskStatus } from "@/lib/types";


export type Task = {
    id: string;
    name: string;
    status: string;
    assigneeId: string;
    workspaceId: string;
    projectId: string;
    position: number;
    dueDate: string;
    assignee: {
        id: string;
        name: string | null;
        email?: string;
        image?: string | null;
    }
    description?: string | null | undefined;
    project: {
        id: string;
        name: string;
        image: string | null;
    }
};
