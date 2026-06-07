import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — EventNest" }] }),
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", full_name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) nav({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: form.full_name, phone: form.phone } },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Account created!");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Discover & book event venues across AP & Telangana.</p>
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <div><Label>Full name</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
          <div><Label>Phone</Label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label>Password</Label><Input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating…" : "Sign Up"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link></p>
      </div>
    </div>
  );
}
