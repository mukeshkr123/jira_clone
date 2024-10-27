import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskFilter } from "../hooks/use-task-filter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";


interface TaskViewSwitcherProps {
    hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = (
    { hideProjectFilter }: TaskViewSwitcherProps
) => {
    const [{ status, dueDate, assigneeId, projectId }] = useTaskFilter();

    return (
        <Tabs
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
                        // onClick={open}
                        size="sm" className="w-full lg:w-auto">
                        <Plus className="size-4 mr-2" />
                        New
                    </Button>
                </div>
                <DottedSeparator className="my-4" />
                <DottedSeparator className="my-4" />

            </div>
        </Tabs>
    )
}
