import { useQuery } from "@tanstack/react-query";
import { ListProductsResponse } from "@shared/api";
import ProductCard from "@/components/shop/ProductCard";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative">
      <div className="container">
        <div className="mt-6 overflow-hidden rounded-2xl border bg-black text-white">
          <div className="relative p-8 md:p-14">
            <div className="absolute right-6 top-6">
              <Link
                to="/shop"
                className="inline-block rounded-md bg-brand px-4 py-2 font-medium text-black uppercase tracking-wide"
              >
                Explore Now
              </Link>
            </div>
            <h1 className="font-display text-[40px] md:text-[88px] leading-none tracking-[0.25em]">
              TIROS
            </h1>
            <div className="mt-6 h-56 md:h-80 rounded-xl bg-neutral-900" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return (await res.json()) as ListProductsResponse;
    },
  });

  return (
    <div>
      <Hero />

      <section className="container py-12">
        <div className="mb-6 h-2 w-40 bg-black" />
        <h2 className="text-center font-display text-2xl tracking-[0.25em]">
          BEST SELLER
        </h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.products?.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="inline-block rounded-md border px-5 py-2 uppercase tracking-wide"
          >
            View All
          </Link>
        </div>
      </section>

      <section className="bg-neutral-950 text-white">
        <div className="container py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 p-6">
              <div className="aspect-square bg-black rounded-lg" />
            </div>
            <div className="rounded-xl border border-white/10 p-6">
              <div className="aspect-square bg-black rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
