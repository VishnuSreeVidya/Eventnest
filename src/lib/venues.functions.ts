import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const listInput = z.object({
  city: z.string().optional(),
  eventType: z.string().optional(),
  maxBudget: z.number().optional(),
  minCapacity: z.number().optional(),
  ac: z.boolean().optional(),
  search: z.string().optional(),
}).partial();

export const listVenues = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listInput.parse(d ?? {}))
  .handler(async ({ data }) => {
    let q = supabaseAdmin.from("venues").select("*").eq("status", "verified");
    if (data.city) q = q.eq("city", data.city);
    if (data.eventType) q = q.contains("event_types", [data.eventType]);
    if (data.maxBudget) q = q.lte("base_price", data.maxBudget);
    if (data.minCapacity) q = q.gte("capacity", data.minCapacity);
    if (data.ac) q = q.eq("ac", true);
    if (data.search) q = q.ilike("name", `%${data.search}%`);
    const { data: rows, error } = await q.order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getVenueBySlug = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { data: venue, error } = await supabaseAdmin
      .from("venues")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!venue) return null;
    const [{ data: reviews }, { data: availability }] = await Promise.all([
      supabaseAdmin.from("reviews").select("*").eq("venue_id", venue.id).order("created_at", { ascending: false }),
      supabaseAdmin.from("availability").select("*").eq("venue_id", venue.id),
    ]);
    return { venue, reviews: reviews ?? [], availability: availability ?? [] };
  });

export const getCities = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin.from("venues").select("city").eq("status", "verified");
  if (error) throw new Error(error.message);
  return Array.from(new Set((data ?? []).map((r) => r.city))).sort();
});
