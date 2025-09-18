import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCollections } from "../db/mongo";

const sign = (payload: object) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

export const register: RequestHandler = async (req, res) => {
  try {
    const { email, password, name, role } = req.body as { email: string; password: string; name?: string; role?: string };
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const { users } = await getCollections();
    const exists = await users.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already in use" });
    const hash = await bcrypt.hash(password, 10);
    const id = `local_${Date.now()}`;
    const now = new Date().toISOString();
    await users.insertOne({ _id: id, id, email, name, passwordHash: hash, role: role === "admin" ? "admin" : "user", createdAt: now, updatedAt: now });
    const token = sign({ id, email, role: role === "admin" ? "admin" : "user" });
    res.status(201).json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to register" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const { users } = await getCollections();
    const user = await users.findOne({ email });
    if (!user?.passwordHash) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = sign({ id: user._id, email: user.email, role: user.role ?? "user" });
    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to login" });
  }
};

export const me: RequestHandler = async (req, res) => {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : undefined;
    if (!token) return res.status(200).json({ user: null });
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: "JWT not configured" });
    const decoded = jwt.verify(token, secret) as any;
    res.json({ user: { id: decoded.id, email: decoded.email, role: decoded.role } });
  } catch {
    res.status(200).json({ user: null });
  }
};
