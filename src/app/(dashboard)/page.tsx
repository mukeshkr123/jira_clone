import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { Button } from "../../components/ui/button";

export default function Home() {
  return (
    <div className="bg-neutral-500 p-4 h-full">
      This is a HomePage
      <CreateWorkspaceForm
      // onCancel={() => { }}
      />
    </div>
  );
}
