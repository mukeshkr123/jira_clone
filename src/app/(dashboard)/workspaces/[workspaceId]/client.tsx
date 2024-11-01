"use client";

import { Analytics } from "@/components/analytics";
import { DottedSeparator } from "@/components/dotted-separator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { Task } from "@/features/tasks/types";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";

export const WorkspaceIdClient = () => {
    const workspaceId = useWorkspaceId();

    const { data: analytics, isLoading: analyticsLoading } = useGetWorkspaceAnalytics({ workspaceId });
    const { data: tasks, isLoading: tasksLoading } = useGetTasks({ workspaceId });
    const { data: projects, isLoading: projectsLoading } = useGetProjects({ workspaceId });
    const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

    const isLoading = analyticsLoading || tasksLoading || projectsLoading || membersLoading;

    if (isLoading) return <PageLoader />;

    if (!analytics || !tasks || !projects || !members)
        return <PageError message="Failed to load workspace data" />;

    return (
        <div className="h-full flex flex-col space-y-4">
            <Analytics data={analytics} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <TaskList data={tasks} total={tasks.length} />
                <ProjectList data={projects} total={projects.length} />
                <MembersList data={members} total={members.length} />
            </div>
        </div>
    );
};

interface TaskListProps {
    data: Task[];
    total: number;
}

export const TaskList = ({ data, total }: TaskListProps) => {
    const { open: createTask } = useCreateTaskModal();
    const workspaceId = useWorkspaceId();
    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Tasks ({total})</p>
                    <Button variant="muted" size="icon" onClick={createTask}>
                        <PlusIcon className="size-4 text-neutral-400" />
                    </Button>
                </div>
                <DottedSeparator className="my-4" />
                <ul className="flex flex-col gap-y-4">
                    {data.map((task) => (
                        <li key={task.id}>
                            <Link href={`/workspaces/${workspaceId}/tasks/${task.id}`}>
                                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                                    <CardContent className="p-4">
                                        <p className="text-lg font-medium truncate">{task.name}</p>
                                        <div className="flex items-center gap-x-2">
                                            <p>{task.project?.name}</p>
                                            <div className="dot" />
                                            <div className="text-sm text-muted-foreground flex items-center">
                                                <CalendarIcon className="size-3 mr-1" />
                                                <span className="truncate">
                                                    {formatDistanceToNow(new Date(task.dueDate))}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    {!data.length && (
                        <li className="text-sm text-muted-foreground text-center">
                            No tasks found
                        </li>
                    )}
                </ul>
                <Button variant="muted" className="mt-4 w-full" asChild>
                    <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
                </Button>
            </div>
        </div>
    );
};

interface Project {
    id: string;
    name: string;
    image?: string | null;
}

interface ProjectListProps {
    data: Project[];
    total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
    const { open: createProject } = useCreateProjectModal();
    const workspaceId = useWorkspaceId();

    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Projects ({total})</p>
                    <Button variant="secondary" size="icon" onClick={createProject}>
                        <PlusIcon className="size-4 text-neutral-400" />
                    </Button>
                </div>
                <DottedSeparator className="my-4" />
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {data.map((project) => (
                        <li key={project.id}>
                            <Link href={`/workspaces/${workspaceId}/projects/${project.id}`}>
                                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                                    <CardContent className="p-4 flex items-center gap-x-2.5">
                                        <ProjectAvatar
                                            className="size-12"
                                            fallbackClassName="text-lg"
                                            name={project.name}
                                            image={project?.image ?? ""}
                                        />
                                        <p className="text-lg font-medium truncate">
                                            {project.name}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    {!data.length && (
                        <li className="text-sm text-muted-foreground text-center">
                            No projects found
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

interface Member {
    id: string;
    workspaceId: string | null;
    userId: string | null;
    role: "ADMIN" | "MEMBER" | null;
    user: {
        name: string | null;
        email: string;
        image: string | null;
    } | null;
}

interface MembersListProps {
    data: Member[];
    total: number;
}

export const MembersList = ({ data, total }: MembersListProps) => {
    const workspaceId = useWorkspaceId();

    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Members ({total})</p>
                    <Button asChild variant="secondary" size="icon">
                        <Link href={`/workspaces/${workspaceId}/members`}>
                            <SettingsIcon className="size-4 text-neutral-400" />
                        </Link>
                    </Button>
                </div>
                <DottedSeparator className="my-4" />
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((member) => (
                        <li key={member.id}>
                            <Card className="shadow-none rounded-lg overflow-hidden">
                                <CardContent className="p-3 flex-col flex items-center gap-x-2">
                                    <MemberAvatar className="size-12" name={member.user?.name ?? ""} />
                                    <div className="flex flex-col items-center overflow-hidden">
                                        <p className="text-lg font-medium line-clamp-1">
                                            {member?.user?.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {member.user?.email}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </li>
                    ))}
                    {!data.length && (
                        <li className="text-sm text-muted-foreground text-center">
                            No members found
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};
