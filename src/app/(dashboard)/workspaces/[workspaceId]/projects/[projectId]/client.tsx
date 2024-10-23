"use client";

import { Analytics } from "@/components/analytics";
import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { Pencil } from "lucide-react";
import Link from "next/link";

export const ProjectIdClient = () => {
    const projectId = useProjectId();

    const project = {
        id: "project.id",
        name: "Project Name",
        workspaceId: "workspace.id",
        imageUrl: "project.imageUrl",
        description: "Project Description",
    }

    const analytics = {
        taskCount: 50,
        taskDiff: 5,
        assignedTaskCount: 30,
        assignedTaskDiff: 10,
        completedTaskCount: 20,
        completeTaskDiff: -2,
        overdueTaskCount: 3,
        overdueTaskDiff: 1,
        incompleteTaskCount: 10,
        incompleteTaskDiff: -3,
    };

    const href = `/workspaces/${project.workspaceId}/projects/${project.id}/settings`;

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <ProjectAvatar
                        name={"project.name"}
                        // image={project.imageUrl}
                        className="size-8"
                    />
                    <p className="text-lg font-semibold">{"project.name"}</p>
                </div>
                <Button variant="secondary" size="sm" asChild>
                    <Link href={href}>
                        <Pencil className="size-4 mr-2" />
                        Edit Project
                    </Link>
                </Button>
            </div>
            {/* <TaskViewSwitcher hideProjectFilter /> */}
            {analytics ? <Analytics data={analytics} /> : null}

        </div>
    )
}