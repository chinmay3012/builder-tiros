import { MongoClient, Db, Collection } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export type Collections = {
  products: Collection;
  users: Collection;
  carts: Collection;
  orders: Collection;
};

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI env var is required to use MongoDB");
  }
  if (db) return db;
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  db = client.db(process.env.MONGODB_DB || "app");
  return db;
}

export async function getCollections(): Promise<Collections> {
  const database = await getDb();
  return {
    products: database.collection("products"),
    users: database.collection("users"),
    carts: database.collection("carts"),
    orders: database.collection("orders"),
  };
}

export async function disconnect(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
