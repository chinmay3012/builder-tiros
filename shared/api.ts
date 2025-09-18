/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Product domain types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  inventory: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface CreateProductRequest {
  title: string;
  price: number;
  description?: string;
  images?: string[];
  category?: string;
  tags?: string[];
  inventory?: number;
}

export interface ListProductsResponse {
  products: Product[];
}

export interface CreateProductResponse {
  product: Product;
}

// Auth/User domain
export interface User {
  id: string; // auth0 sub or custom id
  email: string;
  name?: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
}

// Cart domain
export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

// Orders
export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "completed" | "canceled";
  createdAt: string;
  updatedAt: string;
}

export interface UpsertUserRequest {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface UpsertUserResponse { user: User }

export interface GetCartResponse { cart: Cart }
export interface ModifyCartRequest { productId: string; quantity: number }
export interface CreateOrderRequest { userId: string; items: OrderItem[]; total: number }
export interface CreateOrderResponse { order: Order }
