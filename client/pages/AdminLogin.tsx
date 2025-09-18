import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  }

  return (
    <div className="container max-w-md py-16">
      <h1 className="font-display text-3xl tracking-[0.25em] mb-6">ADMIN LOGIN</h1>
      <form onSubmit={onSubmit} className="rounded-xl border p-6 space-y-4">
        <input className="w-full h-10 rounded-md border bg-background px-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full h-10 rounded-md border bg-background px-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-destructive text-sm">{error}</div>}
        <button type="submit" className="w-full h-10 rounded-md bg-primary text-primary-foreground uppercase tracking-wide">Login</button>
      </form>
      <p className="text-xs text-muted-foreground mt-3">Tip: Register an admin via POST /api/auth/register with role:"admin".</p>
    </div>
  );
}
