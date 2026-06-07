import { Link } from "@tanstack/react-router";
import { MapPin, Users, IndianRupee } from "lucide-react";
type Venue = {
  id: string; name: string; slug: string; city: string; area: string | null;
  capacity: number; base_price: number; cover_image: string | null;
  event_types: string[]; ac: boolean;
};

export function VenueCard({ v }: { v: Venue }) {
  return (
    <Link to="/venues/$slug" params={{ slug: v.slug }} className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 font-semibold">{v.name}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {v.area ? `${v.area}, ` : ""}{v.city}
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Users className="h-3 w-3" />{v.capacity}</span>
          <span className="flex items-center font-semibold text-primary"><IndianRupee className="h-4 w-4" />{v.base_price.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </Link>
  );
}
