import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/shop/ProductCard";
import { ListProductsResponse } from "@shared/api";

export default function Shop() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return (await res.json()) as ListProductsResponse;
    },
  });

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl tracking-[0.25em] mb-6">BEST SELLERS</h1>
      {isLoading && <div>Loading products…</div>}
      {error && <div className="text-destructive">{String((error as Error).message)}</div>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.products?.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
