import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Elysia, t } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";

export const app = new Elysia({ adapter: CloudflareAdapter, prefix: "/api" })
  .derive(async ({ request }) => {
    // Basic API Key validation
    const authHeader = request.headers.get("Authorization");
    const { env } = await getCloudflareContext({ async: true });
    return {
      env: env as CloudflareEnv,
      get isAuthenticated() {
        const apiKey = (env as CloudflareEnv).API_KEY;
        return authHeader === `Bearer ${apiKey}`;
      },
    };
  })
  .get("/", async ({ env }) => {
    const weight = await env.WEIGHT_KV.get("current_weight");
    return weight || "No data yet";
  })
  .get("/history", async ({ env }) => {
    const list = await env.WEIGHT_KV.list({ prefix: "history:" });
    const keys = list.keys.sort((a, b) => a.name.localeCompare(b.name));

    const history = await Promise.all(
      keys.map(async (key) => {
        const value = await env.WEIGHT_KV.get(key.name);
        const timestamp = parseInt(key.name.split(":")[1], 10);
        const weight = parseFloat(value?.replace("kg", "") || "0");
        return {
          timestamp,
          date: new Date(timestamp).toISOString(),
          weight,
        };
      }),
    );

    return history.sort((a, b) => a.timestamp - b.timestamp);
  })
  .post(
    "/weight",
    async ({ body, env, isAuthenticated, set }) => {
      if (!isAuthenticated) {
        set.status = 401;
        return "Unauthorized";
      }

      const { weight, date } = body;
      await env.WEIGHT_KV.put("current_weight", `${weight}kg`);

      // Store history if needed (optional, using timestamp as key)
      const timestamp = date ? new Date(date).getTime() : Date.now();
      await env.WEIGHT_KV.put(`history:${timestamp}`, `${weight}kg`);

      return { success: true, weight, date };
    },
    {
      body: t.Object({
        weight: t.String(),
        date: t.Optional(t.String()),
      }),
    },
  )
  .compile();

export const OPTIONS = app.fetch;
export const HEAD = app.fetch;
export const GET = app.fetch;

export const POST = app.fetch;
export const PUT = app.fetch;
export const PATCH = app.fetch;
export const DELETE = app.fetch;
