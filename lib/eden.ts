import { treaty } from "@elysiajs/eden";
import { app } from "../app/api/[[...slugs]]/route";

export const api =
  typeof window === "undefined"
    ? treaty(app).api
    : treaty<typeof app>(window.location.origin).api;
