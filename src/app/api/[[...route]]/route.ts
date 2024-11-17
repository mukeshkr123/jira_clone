import { Context, Hono } from "hono";
import { handle } from "hono/vercel";
import members from "./members";
import workspace from "./workspace";
import projects from "./projects";
import tasks from "./tasks";
import users from "./users";
import authConfig from "@/auth.config";
// @ts-ignore
import { AuthConfig, initAuthConfig } from "@hono/auth-js";


export const runtime = "nodejs";

//@ts-ignore
function getAuthConfig(c: Context): AuthConfig {
    //@ts-ignore
    return {
        secret: process.env.AUTH_SECRET,
        ...authConfig
    }
}

const app = new Hono().basePath("/api");

app.use("*", initAuthConfig(getAuthConfig));

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