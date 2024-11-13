import { getWorkspaces } from "@/features/workspaces/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const workspaces = await getWorkspaces()

  if (workspaces?.length === 0) {
    redirect("/workspaces/create")
  } else {
    redirect(`/workspaces/${workspaces?.[0].id}`)
  }

}
