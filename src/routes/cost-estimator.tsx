import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { estimateEventCost } from "@/lib/ai.functions";
import { Sparkles, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/cost-estimator")({
  head: () => ({ meta: [{ title: "AI Event Cost Estimator — EventNest" }, { name: "description", content: "Get an instant AI-powered cost estimate for your event in INR." }] }),
  component: Page,
});

function Page() {
  const [form, setForm] = useState({ eventType: "Wedding", guests: 200, city: "Hyderabad", catering: "veg", decoration: "premium" });
  const m = useMutation({
    mutationFn: () => estimateEventCost({ data: form as any }),
    onError: (e: any) => toast.error(e.message),
  });
  const r = m.data;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"><Sparkles className="h-3 w-3" /> AI-powered</span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Event Cost Estimator</h1>
          <p className="mt-2 text-muted-foreground">Get a realistic INR estimate for your event in seconds.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="mt-10 grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-2" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <Field label="Event type"><Input value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} required /></Field>
          <Field label="City"><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></Field>
          <Field label="Guest count"><Input type="number" min={10} value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} required /></Field>
          <Field label="Catering">
            <Select value={form.catering} onValueChange={(v) => setForm({ ...form, catering: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Decoration">
            <Select value={form.decoration} onValueChange={(v) => setForm({ ...form, decoration: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Button type="submit" disabled={m.isPending} size="lg" className="w-full gap-2">
              <Sparkles className="h-4 w-4" />{m.isPending ? "Estimating…" : "Estimate Cost"}
            </Button>
          </div>
        </form>

        {r && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Estimated Breakdown</h2>
            <div className="mt-6 space-y-3">
              {[["Venue rent", r.venue_rent], ["Catering", r.catering], ["Decoration", r.decoration], ["Photography", r.photography], ["Music / DJ", r.music_dj], ["Misc", r.misc]].map(([k, val]) => (
                <Row key={k as string} label={k as string} value={val as number} />
              ))}
              <div className="border-t border-border pt-3">
                <Row label="Total" value={r.total} bold />
              </div>
            </div>
            {r.notes && <p className="mt-6 rounded-lg bg-primary/10 p-4 text-sm text-foreground"><Sparkles className="mr-2 inline h-3 w-3 text-primary" />{r.notes}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: any) {
  return <div><Label className="mb-2 block">{label}</Label>{children}</div>;
}
function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-lg font-bold" : ""}`}>
      <span>{label}</span>
      <span className="flex items-center"><IndianRupee className={bold ? "h-5 w-5" : "h-4 w-4"} />{Number(value || 0).toLocaleString("en-IN")}</span>
    </div>
  );
}
