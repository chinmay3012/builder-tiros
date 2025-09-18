import { RequestHandler } from "express";
import { z } from "zod";
import { getCollections } from "../db/mongo";
import { Product, CreateProductRequest } from "@shared/api";

const createProductSchema = z.object({
  title: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  inventory: z.number().int().min(0).default(0),
});

export const listProducts: RequestHandler = async (_req, res) => {
  try {
    const { products } = await getCollections();
    const docs = (await products
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()) as Product[];
    res.json({ products: docs });
  } catch (err: any) {
    if (err?.message?.includes("MONGODB_URI")) {
      return res.json({ products: [] });
    }
    res.status(500).json({ error: err?.message || "Failed to list products" });
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const parsed = createProductSchema.parse(req.body as CreateProductRequest);
    const now = new Date();
    const doc: Product = {
      id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      title: parsed.title,
      price: parsed.price,
      description: parsed.description ?? "",
      images: parsed.images ?? [],
      category: parsed.category ?? "general",
      tags: parsed.tags ?? [],
      inventory: parsed.inventory ?? 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    const { products } = await getCollections();
    await products.insertOne({ ...doc, _id: doc.id });
    res.status(201).json({ product: doc });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: err.issues.map((i) => i.message).join(", ") });
    }
    if (err?.message?.includes("MONGODB_URI")) {
      return res
        .status(500)
        .json({
          error: "Database not configured. Please set MONGODB_URI env var.",
        });
    }
    res.status(500).json({ error: err?.message || "Failed to create product" });
  }
};

const updateProductSchema = createProductSchema.partial();

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const changes = updateProductSchema.parse(req.body);
    const { products } = await getCollections();
    const now = new Date().toISOString();
    await products.updateOne(
      { _id: id },
      { $set: { ...changes, updatedAt: now } },
    );
    const updated = (await products.findOne(
      { _id: id },
      { projection: { _id: 0 } },
    )) as Product | null;
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json({ product: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError)
      return res
        .status(400)
        .json({ error: err.issues.map((i) => i.message).join(", ") });
    res.status(500).json({ error: err?.message || "Failed to update product" });
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { products } = await getCollections();
    const r = await products.deleteOne({ _id: id });
    if (r.deletedCount === 0)
      return res.status(404).json({ error: "Product not found" });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to delete product" });
  }
};

export const listCategories: RequestHandler = async (_req, res) => {
  try {
    const { products } = await getCollections();
    const cats = await products.distinct("category");
    res.json({ categories: cats.filter(Boolean).sort() });
  } catch (err: any) {
    if (err?.message?.includes("MONGODB_URI"))
      return res.json({ categories: [] });
    res
      .status(500)
      .json({ error: err?.message || "Failed to list categories" });
  }
};
