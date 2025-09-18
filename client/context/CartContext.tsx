import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { id: string; title: string; price: number; image?: string; quantity: number };

type Ctx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
};

const Ctx = createContext<Ctx | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(items)); }, [items]);

  function add(item: CartItem) {
    setItems((arr) => {
      const existing = arr.find((x) => x.id === item.id);
      if (existing) return arr.map((x) => x.id === item.id ? { ...x, quantity: x.quantity + item.quantity } : x);
      return [...arr, item];
    });
  }
  function remove(id: string) { setItems((arr) => arr.filter((x) => x.id !== id)); }
  function clear() { setItems([]); }
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  return <Ctx.Provider value={{ items, add, remove, clear, total }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
