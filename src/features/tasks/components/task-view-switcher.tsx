"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { TaskStatus } from "@/lib/types";
import { Loader, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback } from "react";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilter } from "../hooks/use-task-filter";
import { columns } from "./columns";
import { DataCalander } from "./data-calander";
import { DataFilters } from "./data-filters";
import { DataKanban } from "./data-kanban";
import { DataTable } from "./data-table";

interface TaskViewSwitcherProps {
    hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({
    hideProjectFilter,
}: TaskViewSwitcherProps) => {
    const [{ status, dueDate, assigneeId, projectId }] = useTaskFilter();

    const [view, setView] = useQueryState("task-view", {
        defaultValue: "table",
    });
    const { open } = useCreateTaskModal();
    const workspaceId = useWorkspaceId();
    const paramProjectId = useProjectId();
    const { mutate: bulkUpdate } = useBulkUpdateTasks();
    const { data: tasks, isLoading: tasksLoading } = useGetTasks({
        workspaceId,
        assigneeId,
        projectId: paramProjectId || projectId,
        dueDate,
        status,
    });

    const onKanbanChange = useCallback(
        (
            tasks: {
                id: string;
                status: TaskStatus;
                position: number;
            }[]
        ) => {
            bulkUpdate({
                json: { updatedTasks: tasks },
            });
        },
        []
    );


    return (
        <Tabs
            defaultValue={view}
            onValueChange={setView}
            className="flex-1 w-full border rounded-lg"
        >
            <div className="h-full flex flex-col overflow-auto p-4">
                <div className="flex  lg:flex-row gap-y-2 items-center justify-start w-full">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
                            Table
                        </TabsTrigger>
                    </TabsList>
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
                            Kanban
                        </TabsTrigger>
                    </TabsList>
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
                            Calendar
                        </TabsTrigger>
                    </TabsList>
                    <Button
                        onClick={open}
                        size="sm" className="w-full lg:ml-auto lg:w-auto">
                        <Plus className="size-4 mr-2" />
                        New
                    </Button>
                </div>
                <DottedSeparator className="my-4" />
                <DataFilters hideProjectFilter={hideProjectFilter} />
                <DottedSeparator className="my-4" />
                {tasksLoading ? (
                    <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
                        <Loader className="size-5 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <TabsContent value="table" className="mt-0">
                            <DataTable columns={columns} data={tasks ?? []} />
                        </TabsContent>
                        <TabsContent value="kanban" className="mt-0">
                            <DataKanban
                                onChange={onKanbanChange}
                                data={tasks ?? []}
                            />
                        </TabsContent>
                        <TabsContent value="calendar" className="mt-0 h-full pb-4">
                            <DataCalander
                                data={tasks ?? []} />
                        </TabsContent>
                    </>
                )}
            </div>
        </Tabs>
    );
};