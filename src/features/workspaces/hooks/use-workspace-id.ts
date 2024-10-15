import { useParams } from "next/navigation";

export const useWorkspaceId = () => {
    const params = useParams()
    console.log(params);

    return params.workspaceId as string;
}