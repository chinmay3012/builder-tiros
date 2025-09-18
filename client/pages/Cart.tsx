import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, total, remove } = useCart();
  const navigate = useNavigate();
  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl tracking-[0.25em] mb-6">CART</h1>
      {items.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/shop" className="inline-block mt-4 rounded-md border px-4 py-2">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            {items.map((i) => (
              <div key={i.id} className="flex items-center gap-4 rounded-lg border p-3">
                <div className="h-20 w-20 rounded bg-muted overflow-hidden">
                  {i.image && <img src={i.image} alt={i.title} className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{i.title}</div>
                  <div className="text-sm text-muted-foreground">Qty: {i.quantity}</div>
                </div>
                <div className="font-semibold">${(i.price * i.quantity).toFixed(2)}</div>
                <button className="text-destructive text-sm" onClick={() => remove(i.id)}>Remove</button>
              </div>
            ))}
          </div>
          <aside className="rounded-lg border p-4 h-fit">
            <div className="flex justify-between mb-3"><span>Subtotal</span><span className="font-semibold">${total.toFixed(2)}</span></div>
            <button className="w-full h-10 rounded-md bg-primary text-primary-foreground" onClick={() => navigate("/checkout")}>Checkout</button>
          </aside>
        </div>
      )}
    </div>
  );
}
