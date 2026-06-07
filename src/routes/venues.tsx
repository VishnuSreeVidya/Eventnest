import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { VenueCard } from "@/components/VenueCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listVenues } from "@/lib/venues.functions";

const opts = queryOptions({ queryKey: ["venues", "all"], queryFn: () => listVenues({ data: {} }) });

export const Route = createFileRoute("/venues")({
  head: () => ({ meta: [{ title: "Browse Venues — EventNest" }, { name: "description", content: "Search and filter event venues across AP & Telangana." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: VenuesPage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

function VenuesPage() {
  const { data } = useSuspenseQuery(opts);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [eventType, setEventType] = useState("all");

  const cities = useMemo(() => Array.from(new Set(data.map((v: any) => v.city))).sort(), [data]);
  const eventTypes = useMemo(() => Array.from(new Set(data.flatMap((v: any) => v.event_types ?? []))).sort(), [data]);

  const filtered = data.filter((v: any) => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (city !== "all" && v.city !== city) return false;
    if (eventType !== "all" && !(v.event_types ?? []).includes(eventType)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Browse Venues</h1>
        <p className="mt-2 text-muted-foreground">{filtered.length} venues found</p>

        <div className="mt-6 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-3">
          <Input placeholder="Search by name…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger><SelectValue placeholder="Event type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All event types</SelectItem>
              {eventTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v: any) => <VenueCard key={v.id} v={v} />)}
        </div>
        {filtered.length === 0 && <p className="mt-12 text-center text-muted-foreground">No venues match your filters.</p>}
      </div>
    </div>
  );
}
