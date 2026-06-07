import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { myVenues, createVenue } from "@/lib/owner.functions";
import { ownerEnquiries, updateEnquiryStatus } from "@/lib/enquiries.functions";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/owner")({
  head: () => ({ meta: [{ title: "Owner Dashboard — EventNest" }] }),
  component: OwnerPage,
});

function OwnerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Owner Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage your venues and customer enquiries.</p>
        <Tabs defaultValue="venues" className="mt-8">
          <TabsList><TabsTrigger value="venues">My Venues</TabsTrigger><TabsTrigger value="enquiries">Enquiries</TabsTrigger></TabsList>
          <TabsContent value="venues" className="mt-6"><VenuesTab /></TabsContent>
          <TabsContent value="enquiries" className="mt-6"><EnquiriesTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function VenuesTab() {
  const { data, isLoading, refetch } = useQuery({ queryKey: ["my-venues"], queryFn: () => myVenues() });

  return (
    <div>
      <div className="mb-4 flex justify-end"><NewVenueDialog onDone={refetch} /></div>
      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {!isLoading && (data?.length ?? 0) === 0 && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No venues yet. Click "Add Venue" to list your first space.</p>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((v: any) => (
          <Link key={v.id} to="/venues/$slug" params={{ slug: v.slug }} className="flex gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/50">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{v.name}</h3>
                <Badge variant={v.status === "verified" ? "default" : "secondary"}>{v.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{v.city} · Capacity {v.capacity}</p>
              <p className="mt-1 text-sm">₹{Number(v.base_price).toLocaleString("en-IN")} · {v.views} views</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NewVenueDialog({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", city: "Hyderabad", area: "", address: "",
    capacity: 200, base_price: 50000, decoration_cost: 0, catering_cost_per_plate: 0,
    ac: true, parking: true, catering_available: true, decoration_available: false,
    event_types: ["Wedding"], amenities: [] as string[], cover_image: "", contact_phone: "", contact_email: "",
  });
  const m = useMutation({
    mutationFn: () => createVenue({ data: form as any }),
    onSuccess: () => { toast.success("Venue submitted for review!"); setOpen(false); onDone(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Venue</Button></DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>List a new venue</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="grid gap-3 md:grid-cols-2">
          <F label="Name"><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} /></F>
          <F label="Slug"><Input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></F>
          <F label="City"><Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></F>
          <F label="Area"><Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} /></F>
          <div className="md:col-span-2"><F label="Address"><Input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></F></div>
          <div className="md:col-span-2"><F label="Description"><Textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></F></div>
          <F label="Capacity"><Input type="number" required value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></F>
          <F label="Base price (₹)"><Input type="number" required value={form.base_price} onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })} /></F>
          <F label="Contact phone"><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></F>
          <F label="Contact email"><Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></F>
          <Toggle label="AC" v={form.ac} on={(b) => setForm({ ...form, ac: b })} />
          <Toggle label="Parking" v={form.parking} on={(b) => setForm({ ...form, parking: b })} />
          <Toggle label="Catering available" v={form.catering_available} on={(b) => setForm({ ...form, catering_available: b })} />
          <Toggle label="Decoration available" v={form.decoration_available} on={(b) => setForm({ ...form, decoration_available: b })} />
          <div className="md:col-span-2"><Button type="submit" disabled={m.isPending} className="w-full">{m.isPending ? "Submitting…" : "Submit Venue"}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children }: any) { return <div><Label className="mb-1.5 block">{label}</Label>{children}</div>; }
function Toggle({ label, v, on }: { label: string; v: boolean; on: (b: boolean) => void }) {
  return <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2"><span className="text-sm">{label}</span><Switch checked={v} onCheckedChange={on} /></div>;
}

function EnquiriesTab() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["owner-enquiries"], queryFn: () => ownerEnquiries() });
  const m = useMutation({
    mutationFn: (vars: { id: string; status: any; response?: string }) => updateEnquiryStatus({ data: vars }),
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["owner-enquiries"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!data?.length) return <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">No enquiries yet.</div>;

  return (
    <div className="space-y-3">
      {data.map((e: any) => (
        <div key={e.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold">{e.venues?.name}</h3>
              <p className="text-sm text-muted-foreground">{e.event_type} · {e.guest_count} guests · {new Date(e.event_date).toLocaleDateString()}</p>
              <p className="mt-1 text-sm">📞 {e.contact_phone}</p>
              {e.message && <p className="mt-2 text-sm text-muted-foreground">"{e.message}"</p>}
            </div>
            <Badge variant={e.status === "accepted" ? "default" : e.status === "rejected" ? "destructive" : "secondary"}>{e.status}</Badge>
          </div>
          {e.status === "pending" && (
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => m.mutate({ id: e.id, status: "accepted" })}>Accept</Button>
              <Button size="sm" variant="outline" onClick={() => m.mutate({ id: e.id, status: "rejected" })}>Reject</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
