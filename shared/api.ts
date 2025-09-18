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
