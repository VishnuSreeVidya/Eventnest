import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md" style={{ background: "var(--gradient-primary)" }} />
          <span className="text-lg font-bold tracking-tight">EventNest</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/venues" className="text-muted-foreground hover:text-foreground">Browse Venues</Link>
          <Link to="/cost-estimator" className="text-muted-foreground hover:text-foreground">AI Cost Estimator</Link>
          <Link to="/owner" className="text-muted-foreground hover:text-foreground">List Your Venue</Link>
        </nav>
        <div className="flex items-center gap-2">
          {email ? (
            <>
              <Link to="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
              <Button size="sm" variant="outline" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
