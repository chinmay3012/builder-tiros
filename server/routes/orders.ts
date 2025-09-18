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

export const listAllOrders: RequestHandler = async (_req, res) => {
  try {
    const { orders } = await getCollections();
    const docs = await orders.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(200).toArray();
    res.json({ orders: docs });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to list orders" });
  }
};

export const updateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body as { status: Order["status"] };
    const { orders } = await getCollections();
    const now = new Date().toISOString();
    await orders.updateOne({ _id: id }, { $set: { status, updatedAt: now } });
    const updated = await orders.findOne({ _id: id }, { projection: { _id: 0 } });
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json({ order: updated });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to update order" });
  }
};
