import { Hono } from "hono";
import { handle } from "hono/vercel";
import members from "./members";
import workspace from "./workspace";
import projects from "./projects";
import tasks from "./tasks";
import users from "./users";

export const runtime = "nodejs";

const app = new Hono().basePath("/api")

const routes = app
    .route("/workspaces", workspace)
    .route("/members", members)
    .route("/projects", projects)
    .route("/tasks", tasks)
    .route("/users", users)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;