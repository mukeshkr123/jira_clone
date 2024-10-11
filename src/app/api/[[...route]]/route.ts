import { Hono } from "hono";
import { handle } from "hono/vercel";
import workspace from "./workspace"

export const runtime = "nodejs";

const app = new Hono().basePath("/api")

const routes = app
    .route("/workspaces", workspace)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;