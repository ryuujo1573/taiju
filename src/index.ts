import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker"

interface Env {
}

// Create the main app logic
// We don't initialize env here, but expect it to be available in the store
const app = new Elysia({
  adapter: CloudflareAdapter,
})
  .get("/", () => "Hello from Cloudflare Workers + Elysia")
  .compile()

export default app