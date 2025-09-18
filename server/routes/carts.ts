import { RequestHandler } from "express";
import { getCollections } from "../db/mongo";
import { Cart, ModifyCartRequest, GetCartResponse } from "@shared/api";

export const getCart: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { carts } = await getCollections();
    const existing = (await carts.findOne({ _id: userId })) as any;
    const cart: Cart = existing ?? {
      userId,
      items: [],
      updatedAt: new Date().toISOString(),
    };
    res.json({ cart } as GetCartResponse);
  } catch (err: any) {
    if (err?.message?.includes("MONGODB_URI"))
      return res.json({
        cart: {
          userId: req.params.userId,
          items: [],
          updatedAt: new Date().toISOString(),
        },
      });
    res.status(500).json({ error: err?.message || "Failed to get cart" });
  }
};

export const addToCart: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const body = req.body as ModifyCartRequest;
    const { carts } = await getCollections();
    const now = new Date().toISOString();
    await carts.updateOne(
      { _id: userId },
      {
        $set: { updatedAt: now },
        $setOnInsert: { _id: userId, userId, items: [] },
        $push: {
          items: { productId: body.productId, quantity: body.quantity },
        },
      },
      { upsert: true },
    );
    const updated = await carts.findOne({ _id: userId });
    res.json({ cart: updated });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to add to cart" });
  }
};

export const removeFromCart: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const body = req.body as ModifyCartRequest;
    const { carts } = await getCollections();
    const now = new Date().toISOString();
    await carts.updateOne(
      { _id: userId },
      {
        $set: { updatedAt: now },
        $pull: { items: { productId: body.productId } },
      },
    );
    const updated = await carts.findOne({ _id: userId });
    res.json({ cart: updated });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err?.message || "Failed to remove from cart" });
  }
};
