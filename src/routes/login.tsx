import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — EventNest" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) nav({ to: "/dashboard", replace: true });
    });
    supabase.auth.getUser().then(({ data }) => { if (data.user) nav({ to: "/dashboard", replace: true }); });
    return () => sub.subscription.unsubscribe();
  }, [nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message); else toast.success("Welcome back!");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to your EventNest account.</p>
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Signing in…" : "Sign In"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">No account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></p>
      </div>
    </div>
  );
}
