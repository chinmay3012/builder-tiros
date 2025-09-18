import { Product } from "@shared/api";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  return (
    <div className="group">
      <div className="aspect-square bg-muted overflow-hidden rounded-lg relative">
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            No image
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 border rounded-lg" />
      </div>
      <div className="mt-3">
        <div className="text-sm uppercase tracking-wide">{product.title}</div>
        <div className="text-xs text-muted-foreground">{product.category}</div>
        <div className="mt-1 font-semibold">${product.price.toFixed(2)}</div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            (window as any).addToCart?.({
              id: product.id,
              title: product.title,
              price: product.price,
              image,
              quantity: 1,
            });
          }}
          className="mt-2 inline-block rounded-md border px-3 py-1 text-xs uppercase tracking-wide"
        >
          Add to Cart
        </a>
      </div>
    </div>
  );
}
