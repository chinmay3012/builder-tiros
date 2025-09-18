import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { listProducts, createProduct, deleteProduct, updateProduct, listCategories } from "./routes/products";
import { upsertUser, getUser } from "./routes/users";
import { getCart, addToCart, removeFromCart } from "./routes/carts";
import { createOrder, listOrdersForUser, listAllOrders, updateOrderStatus } from "./routes/orders";
import { register, login, me } from "./routes/auth";
import { requireAuth, requireAdmin } from "./middleware/auth";
import { uploadFromUrl } from "./routes/upload";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health/Ping
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo
  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", me);

  // Product APIs
  app.get("/api/products", listProducts);
  app.get("/api/categories", listCategories);
  app.post("/api/admin/products", requireAuth, requireAdmin, createProduct);
  app.patch("/api/admin/products/:id", requireAuth, requireAdmin, updateProduct);
  app.delete("/api/admin/products/:id", requireAuth, requireAdmin, deleteProduct);

  // User APIs
  app.post("/api/users/upsert", upsertUser);
  app.get("/api/users/:id", getUser);

  // Cart APIs
  app.get("/api/cart/:userId", getCart);
  app.post("/api/cart/:userId/add", addToCart);
  app.post("/api/cart/:userId/remove", removeFromCart);

  // Orders
  app.post("/api/orders", createOrder);
  app.get("/api/orders/:userId", listOrdersForUser);
  app.get("/api/admin/orders", requireAuth, requireAdmin, listAllOrders);
  app.patch("/api/admin/orders/:id/status", requireAuth, requireAdmin, updateOrderStatus);

  return app;
}
