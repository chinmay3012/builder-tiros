import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function placeOrder() {
    if (items.length === 0) return;
    setStatus("Placing order…");
    const payload = {
      userId: email || "guest",
      items: items.map((i) => ({ productId: i.id, title: i.title, price: i.price, quantity: i.quantity })),
      total,
    };
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const d = await r.json();
    if (!r.ok) { setStatus(d.error || "Order failed"); return; }
    clear();
    setStatus(`Order ${d.order.id} placed!`);
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl tracking-[0.25em] mb-6">CHECKOUT</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border p-4">
          <div className="mb-4">
            <label className="text-sm">Email (for receipt)</label>
            <input className="mt-1 w-full h-10 rounded-md border bg-background px-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="h-10 px-4 rounded-md bg-primary text-primary-foreground" onClick={placeOrder}>Place Order</button>
          {status && <div className="mt-3 text-sm">{status}</div>}
        </div>
        <aside className="rounded-lg border p-4 h-fit">
          <div className="font-semibold mb-2">Order Summary</div>
          <ul className="text-sm space-y-1">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between"><span>{i.title} × {i.quantity}</span><span>${(i.price * i.quantity).toFixed(2)}</span></li>
            ))}
          </ul>
          <div className="flex justify-between mt-3"><span>Total</span><span className="font-semibold">${total.toFixed(2)}</span></div>
        </aside>
      </div>
    </div>
  );
}
