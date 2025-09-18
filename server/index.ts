import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { listProducts, createProduct } from "./routes/products";

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

  // Product APIs
  app.get("/api/products", listProducts);
  app.post("/api/admin/products", createProduct);

  return app;
}
