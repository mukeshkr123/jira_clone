import { TaskStatus } from "@/features/projects/types";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export const useTaskFilter = () => {
    return useQueryStates({
        projectId: parseAsString,
        status: parseAsStringEnum(Object.values(TaskStatus)),
        assigneeId: parseAsString,
        search: parseAsString,
        dueDate: parseAsString,
    });
};