import type { Request, Response } from "express";
import { createApp } from "../server/_core/index";

const app = createApp();

export default function handler(req: Request, res: Response) {
  const originalPath = typeof req.query.__path === "string" ? req.query.__path : "/api/trpc";
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === "__path") continue;
    if (Array.isArray(value)) value.forEach(item => query.append(key, item));
    else if (value !== undefined) query.set(key, String(value));
  }
  req.url = `${originalPath}${query.toString() ? `?${query.toString()}` : ""}`;
  return app(req, res);
}
