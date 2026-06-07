import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { getVenueBySlug } from "@/lib/venues.functions";
import { createEnquiry } from "@/lib/enquiries.functions";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Users, IndianRupee, Check, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

const opts = (slug: string) =>
  queryOptions({ queryKey: ["venue", slug], queryFn: () => getVenueBySlug({ data: { slug } }) });

export const Route = createFileRoute("/venues/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(opts(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${(loaderData as any)?.venue.name ?? "Venue"} — EventNest` },
      { name: "description", content: (loaderData as any)?.venue.description?.slice(0, 160) ?? "" },
      { property: "og:image", content: (loaderData as any)?.venue.cover_image ?? "" },
    ],
  }),
  component: VenuePage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Venue not found.</div>,
});

function VenuePage() {
  const slug = Route.useParams().slug;
  const { data } = useSuspenseQuery(opts(slug));
  const v = (data as any)!.venue;
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {v.area ? `${v.area}, ` : ""}{v.city}
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">{v.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {(v.event_types ?? []).map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat icon={<Users />} label="Capacity" value={v.capacity.toLocaleString("en-IN")} />
            <Stat icon={<IndianRupee />} label="From" value={`₹${Number(v.base_price).toLocaleString("en-IN")}`} />
            <Stat icon={v.ac ? <Check /> : <X />} label="AC" value={v.ac ? "Yes" : "No"} />
            <Stat icon={v.parking ? <Check /> : <X />} label="Parking" value={v.parking ? "Yes" : "No"} />
          </div>

          <section>
            <h2 className="text-xl font-semibold">About this venue</h2>
            <p className="mt-3 whitespace-pre-line text-muted-foreground">{v.description}</p>
          </section>

          {(v.amenities ?? []).length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">Amenities</h2>
              <ul className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
                {v.amenities.map((a: string) => (
                  <li key={a} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> {a}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <p className="text-sm text-muted-foreground">Starting from</p>
            <p className="mt-1 flex items-center text-3xl font-bold"><IndianRupee className="h-6 w-6" />{Number(v.base_price).toLocaleString("en-IN")}</p>
            {authed ? (
              <EnquiryForm venueId={v.id} />
            ) : (
              <div className="mt-6 space-y-2">
                <p className="text-sm text-muted-foreground">Sign in to send an enquiry to the venue owner.</p>
                <Link to="/login"><Button className="w-full">Login to Enquire</Button></Link>
              </div>
            )}
            <Link to="/cost-estimator" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <Sparkles className="h-3 w-3" /> Estimate full event cost
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: any) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon} {label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function EnquiryForm({ venueId }: { venueId: string }) {
  const [form, setForm] = useState({ event_date: "", guest_count: 100, event_type: "Wedding", contact_phone: "", message: "" });
  const m = useMutation({
    mutationFn: () => createEnquiry({ data: { venue_id: venueId, ...form } }),
    onSuccess: () => { toast.success("Enquiry sent!"); setForm({ ...form, message: "" }); },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="mt-6 space-y-3">
      <div><Label>Event date</Label><Input type="date" required value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></div>
      <div><Label>Guests</Label><Input type="number" min={1} required value={form.guest_count} onChange={(e) => setForm({ ...form, guest_count: Number(e.target.value) })} /></div>
      <div><Label>Event type</Label><Input required value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} /></div>
      <div><Label>Phone</Label><Input required value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></div>
      <div><Label>Message</Label><Textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
      <Button type="submit" className="w-full" disabled={m.isPending}>{m.isPending ? "Sending…" : "Send Enquiry"}</Button>
    </form>
  );
}
