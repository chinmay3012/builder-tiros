import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

function Header() {
  const { pathname } = useLocation();
  const nav = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/reviews", label: "Reviews" },
    { to: "/cart", label: "Cart" },
    { to: "/admin", label: "Admin" },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-display tracking-[0.25em] text-2xl">TIROS</Link>
        <nav className="flex items-center gap-6 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "uppercase tracking-wide hover:text-primary transition-colors",
                pathname === n.to && "text-primary",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t bg-muted/20">
      <div className="container py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-display tracking-[0.25em] text-2xl">TIROS</div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            Performance gear for the modern arena. Built with precision.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3">Menu</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:underline">Best Sellers</Link></li>
            <li><Link to="/shop" className="hover:underline">New Arrivals</Link></li>
            <li><Link to="/shop" className="hover:underline">Sale</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Newsletter</div>
          <form className="flex gap-2">
            <input type="email" required placeholder="E-mail address" className="flex-1 h-10 rounded-md border bg-background px-3" />
            <button className="h-10 px-4 rounded-md bg-foreground text-background uppercase tracking-wide">Save</button>
          </form>
        </div>
      </div>
      <div className="border-t py-4 text-xs text-muted-foreground text-center">© {new Date().getFullYear()} Tiros</div>
    </footer>
  );
}

export default function SiteLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
