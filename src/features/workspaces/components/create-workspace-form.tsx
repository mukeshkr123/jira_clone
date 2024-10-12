"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { workspaceSchema } from "@/lib/validation";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";

interface CreateWorkspaceProps {
    onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceProps) => {
    const { mutate, isPending } = useCreateWorkspace()
    const form = useForm<z.infer<typeof workspaceSchema>>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: ""
        }
    })

    const onSubmit = (values: z.infer<typeof workspaceSchema>) => {
        mutate({ name: values.name })
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create New Workspace
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <Separator />
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Workspace Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter workspace name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator className="my-7" />
                        <div className="flex items-center justify-between">
                            <Button type="button" size="lg" variant="secondary" onClick={onCancel}
                                disabled={isPending}
                            >Cancel
                            </Button>
                            <Button
                                disabled={isPending}
                                type="submit" size="lg">
                                Create Workspace
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}