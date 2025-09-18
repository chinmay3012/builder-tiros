import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser { id: string; email: string; role: "user" | "admin" }

export const requireAuth: RequestHandler = (req, res, next) => {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : undefined;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: "JWT not configured" });
    const payload = jwt.verify(token, secret) as AuthUser & { iat: number };
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  const user = (req as any).user as AuthUser | undefined;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  if (user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  next();
};
