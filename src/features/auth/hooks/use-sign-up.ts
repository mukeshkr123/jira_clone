import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";


type ResponseType = InferResponseType<typeof client.api.users["$post"]>;
type RequestType = InferRequestType<typeof client.api.users["$post"]>["json"];


export const useSignup = () => {
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >(
        {
            mutationFn: async (json) => {
                const response = await client.api.users.$post({ json })
                if (!response.ok) {
                    throw new Error("Something went wrong");
                }
                return await response.json();
            },
            onSuccess: () => {
                toast.success("User created");
            }
        }
    )
    return mutation;

}