import { RequestHandler } from "express";
import { getCollections } from "../db/mongo";
import { CreateOrderRequest, CreateOrderResponse, Order } from "@shared/api";

export const createOrder: RequestHandler = async (req, res) => {
  try {
    const payload = req.body as CreateOrderRequest;
    const { orders } = await getCollections();
    const now = new Date();
    const order: Order = {
      id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: payload.userId,
      items: payload.items,
      total: payload.total,
      status: "pending",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    await orders.insertOne({ ...order, _id: order.id });
    const resp: CreateOrderResponse = { order };
    res.status(201).json(resp);
  } catch (err: any) {
    if (err?.message?.includes("MONGODB_URI")) return res.status(500).json({ error: "Database not configured" });
    res.status(500).json({ error: err?.message || "Failed to create order" });
  }
};

export const listOrdersForUser: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { orders } = await getCollections();
    const docs = await orders.find({ userId }, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
    res.json({ orders: docs });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to list orders" });
  }
};
