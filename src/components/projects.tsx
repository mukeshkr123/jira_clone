"use client"

import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { RiAddCircleFill } from 'react-icons/ri';

const imageUrl = "https://images.unsplash.com/photo-1720048169707-a32d6dfca0b3"

const projects = [
    {
        id: 1,
        name: "Project 1",
        image: imageUrl
    }
]

export const Projects = () => {
    const pathname = usePathname();
    const workspaceId = useWorkspaceId();
    const { open } = useCreateProjectModal();

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Projects</p>
                <RiAddCircleFill
                    onClick={open}
                    className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
                />
            </div>
            {
                projects?.map((project) => {
                    const href = `/workspaces/${workspaceId}/projects/${project.id}`;
                    const isActive = pathname === href;
                    return (
                        <Link href={href} key={project.id}>
                            <div
                                className={cn(
                                    "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                                    isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                                )}
                            >
                                <ProjectAvatar image={project?.image} name={project?.name} />
                                <span className="truncate">{project.name}</span>
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}
