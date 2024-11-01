import db from "@/db";

export const getWorkspaces = async () => {
    try {

        // TODO: fetched based on the userId
        const workspaces = await db.query.workspaces.findMany()

        return workspaces;
    } catch (error) {
        console.log(error);
        return null;
    }
}