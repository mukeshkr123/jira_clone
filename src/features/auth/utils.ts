import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const protectServer = async () => {
    const session = await auth();

    console.log(session);


    if (!session) {
        redirect("/api/auth/signin")
    }
}