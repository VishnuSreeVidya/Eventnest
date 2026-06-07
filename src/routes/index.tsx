import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { VenueCard } from "@/components/VenueCard";
import { Button } from "@/components/ui/button";
import { listVenues } from "@/lib/venues.functions";
import { Sparkles, MapPin, ShieldCheck, Search } from "lucide-react";
import hero from "@/assets/hero.png";

const featuredOpts = queryOptions({
  queryKey: ["venues", "featured"],
  queryFn: () => listVenues({ data: {} }),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EventNest — Find Wedding & Event Venues in AP & Telangana" },
      { name: "description", content: "Discover convention halls, wedding venues, and banquet spaces across Andhra Pradesh and Telangana. AI cost estimator included." },
      { property: "og:title", content: "EventNest — Premium Venue Discovery" },
      { property: "og:description", content: "Find and book wedding & event venues across Andhra Pradesh and Telangana." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(featuredOpts),
  component: Index,
  errorComponent: ({ error }) => <div className="p-8 text-center text-destructive">{error.message}</div>,
});

function Index() {
  const { data: venues } = useSuspenseQuery(featuredOpts);
  const featured = venues.slice(0, 6);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={hero} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.85 }} />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> AI-powered event planning
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Find the perfect venue for your <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">moment</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Discover hand-picked convention halls, wedding venues, and banquet spaces across Andhra Pradesh & Telangana.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/venues"><Button size="lg" className="gap-2"><Search className="h-4 w-4" /> Browse Venues</Button></Link>
              <Link to="/cost-estimator"><Button size="lg" variant="outline" className="gap-2"><Sparkles className="h-4 w-4" /> AI Cost Estimator</Button></Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              <Stat n="500+" l="Venues" />
              <Stat n="15+" l="Cities" />
              <Stat n="100%" l="Verified" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Venues</h2>
            <p className="mt-2 text-muted-foreground">Hand-picked spaces across AP & Telangana.</p>
          </div>
          <Link to="/venues" className="text-sm font-medium text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v: any) => <VenueCard key={v.id} v={v} />)}
        </div>
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl grid gap-8 px-4 py-16 md:grid-cols-3">
          <Feature icon={<MapPin />} title="Across AP & Telangana" desc="From Hyderabad to Visakhapatnam, find venues in every major city." />
          <Feature icon={<ShieldCheck />} title="Verified Listings" desc="Every venue is verified for authenticity, capacity and amenities." />
          <Feature icon={<Sparkles />} title="AI Cost Estimator" desc="Get instant cost estimates for your event in INR, powered by AI." />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EventNest. Built with care in India.
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return <div><div className="text-2xl font-bold">{n}</div><div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div></div>;
}
function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div>
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
