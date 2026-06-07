import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { myEnquiries } from "@/lib/enquiries.functions";
export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "My Dashboard — EventNest" }] }),
  component: Page,
});

function Page() {
  const { data, isLoading } = useQuery({ queryKey: ["my-enquiries"], queryFn: () => myEnquiries() });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Enquiries</h1>
            <p className="mt-2 text-muted-foreground">Track your venue enquiries and owner responses.</p>
          </div>
          <Link to="/owner" className="text-sm text-primary hover:underline">Are you a venue owner? →</Link>
        </div>

        {isLoading && <p className="mt-10 text-muted-foreground">Loading…</p>}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <div className="mt-10 rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">No enquiries yet.</p>
            <Link to="/venues" className="mt-4 inline-block text-primary hover:underline">Browse venues →</Link>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {data?.map((e: any) => (
            <Link key={e.id} to="/venues/$slug" params={{ slug: e.venues?.slug ?? "" }} className="flex gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-primary/50">
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{e.venues?.name ?? "Venue"}</h3>
                  <Badge variant={e.status === "accepted" ? "default" : e.status === "rejected" ? "destructive" : "secondary"}>{e.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{e.event_type} · {e.guest_count} guests · {new Date(e.event_date).toLocaleDateString()}</p>
                {e.owner_response && <p className="mt-2 rounded-md bg-muted/30 p-2 text-xs text-muted-foreground"><strong>Owner: </strong>{e.owner_response}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
