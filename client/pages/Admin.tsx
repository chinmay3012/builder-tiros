import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateProductRequest, CreateProductResponse, ListProductsResponse } from "@shared/api";
import { useState } from "react";

export default function Admin() {
  const qc = useQueryClient();
  const [form, setForm] = useState<CreateProductRequest>({
    title: "",
    price: 0,
    description: "",
    images: [],
    category: "general",
    inventory: 0,
  });

  const list = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return (await res.json()) as ListProductsResponse;
    },
  });

  const create = useMutation({
    mutationFn: async (payload: CreateProductRequest) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as CreateProductResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to create product");
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  function update<K extends keyof CreateProductRequest>(key: K, value: CreateProductRequest[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="container py-10 grid gap-10 lg:grid-cols-[400px_1fr]">
      <section>
        <h1 className="font-display text-2xl tracking-[0.25em] mb-4">ADMIN</h1>
        <div className="rounded-xl border p-5 bg-card">
          <div className="space-y-4">
            <div>
              <label className="text-sm">Title</label>
              <input className="mt-1 w-full h-10 rounded-md border bg-background px-3" value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Price</label>
              <input type="number" className="mt-1 w-full h-10 rounded-md border bg-background px-3" value={form.price} onChange={(e) => update("price", Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm">Category</label>
              <input className="mt-1 w-full h-10 rounded-md border bg-background px-3" value={form.category} onChange={(e) => update("category", e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Inventory</label>
              <input type="number" className="mt-1 w-full h-10 rounded-md border bg-background px-3" value={form.inventory ?? 0} onChange={(e) => update("inventory", Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm">Description</label>
              <textarea className="mt-1 w-full min-h-24 rounded-md border bg-background px-3 py-2" value={form.description} onChange={(e) => update("description", e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Add image URL</label>
              <div className="mt-1 flex gap-2">
                <input className="flex-1 h-10 rounded-md border bg-background px-3" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                <button type="button" className="h-10 px-4 rounded-md bg-foreground text-background" onClick={() => {
                  if (!imageUrl) return; update("images", [...(form.images || []), imageUrl]); setImageUrl("");
                }}>Add</button>
              </div>
              {form.images && form.images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.images.map((u, i) => (
                    <div key={u + i} className="relative">
                      <img src={u} alt="product" className="h-16 w-16 object-cover rounded" />
                      <button type="button" className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-5 w-5 text-xs" onClick={() => update("images", form.images!.filter((x) => x !== u))}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              className="w-full h-10 rounded-md bg-primary text-primary-foreground uppercase tracking-wide"
              onClick={() => create.mutate(form)}
              disabled={create.isPending}
            >
              {create.isPending ? "Saving…" : "Create Product"}
            </button>
            {create.isError && <div className="text-destructive text-sm">{(create.error as Error).message}</div>}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Recent products</h2>
        {list.isLoading && <div>Loading…</div>}
        {list.error && <div className="text-destructive">{String((list.error as Error).message)}</div>}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.data?.products?.map((p) => (
            <div key={p.id} className="rounded-lg border p-3">
              <div className="aspect-square bg-muted rounded mb-3 overflow-hidden">
                {p.images[0] && <img src={p.images[0]} className="h-full w-full object-cover" alt={p.title} />}
              </div>
              <div className="text-sm font-medium">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.category}</div>
              <div className="mt-1 font-semibold">${p.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
