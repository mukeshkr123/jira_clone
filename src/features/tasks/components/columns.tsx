"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVerticalIcon } from "lucide-react";

import { snakeCaseToTitleCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/members-avatar";

import { TaskDate } from "./task-date";
import { Task } from "../types";
import { TaskActions } from "./task-actions";
import { Badge } from "@/components/ui/badge";
import { TaskStatus } from "@/lib/types";

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Task Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const name = row.original.name;
            return <p className="line-clamp-1">{name}</p>;
        },
    },
    {
        accessorKey: "project",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Project
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const project = row.original.project;
            return (
                <div className="flex items-center gap-x-2 font-medium">
                    <ProjectAvatar
                        image={project?.image ?? ""}
                        className="size-6"
                        name={project?.name}
                    />
                    <p className="line-clamp-1">{project?.name}</p>
                </div>
            );
        },
    },
    {
        accessorKey: "assignee",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Assignee
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-x-2 font-medium">
                    <MemberAvatar
                        fallbackClassName="text-xs"
                        className="size-6"
                        name={row.original.assignee?.name ?? ""}
                        image={row.original.assignee?.image ?? ""}
                    />
                    <p>{row.original.assignee.name}</p>
                </div>
            );
        },
    },
    {
        accessorKey: "dueDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Due Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const dueDate = row.original.dueDate;
            return <TaskDate value={dueDate} />;
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.original.status;
            return <Badge variant={status as TaskStatus}>{snakeCaseToTitleCase(status)}</Badge>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const id = row.original.id;
            const projectId = row.original.projectId;
            return (
                <>

                    <TaskActions id={id} projectId={projectId}>
                        <Button variant="ghost" className="size-8 p-0">
                            <MoreVerticalIcon className="size-4" />
                        </Button>
                    </TaskActions >
                </>
            );
        },
    },
];