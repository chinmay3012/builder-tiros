import { RequestHandler } from "express";
import { getCollections } from "../db/mongo";
import { UpsertUserRequest, UpsertUserResponse, User } from "@shared/api";

export const upsertUser: RequestHandler = async (req, res) => {
  try {
    const payload = req.body as UpsertUserRequest;
    const { users } = await getCollections();
    const now = new Date().toISOString();
    const userDoc: User = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      createdAt: now,
      updatedAt: now,
    };
    await users.updateOne(
      { _id: payload.id },
      {
        $setOnInsert: { createdAt: now },
        $set: { ...userDoc, updatedAt: now, _id: payload.id },
      },
      { upsert: true },
    );
    const result: UpsertUserResponse = { user: userDoc };
    res.json(result);
  } catch (err: any) {
    if (err?.message?.includes("MONGODB_URI"))
      return res.status(500).json({ error: "Database not configured" });
    res.status(500).json({ error: err?.message || "Failed to upsert user" });
  }
};

export const getUser: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { users } = await getCollections();
    const doc = await users.findOne({ _id: id }, { projection: { _id: 0 } });
    if (!doc) return res.status(404).json({ error: "User not found" });
    res.json({ user: doc });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to get user" });
  }
};
