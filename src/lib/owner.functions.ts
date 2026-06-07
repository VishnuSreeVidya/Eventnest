import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const venueInput = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).regex(/^[a-z0-9-]+$/),
  description: z.string().min(20).max(4000),
  city: z.string().min(2).max(80),
  area: z.string().max(120).optional(),
  address: z.string().min(5).max(500),
  capacity: z.number().int().min(10).max(20000),
  base_price: z.number().min(0),
  decoration_cost: z.number().min(0).default(0),
  catering_cost_per_plate: z.number().min(0).default(0),
  ac: z.boolean().default(false),
  parking: z.boolean().default(false),
  catering_available: z.boolean().default(false),
  decoration_available: z.boolean().default(false),
  event_types: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  cover_image: z.string().max(500).optional(),
  contact_phone: z.string().max(20).optional(),
  contact_email: z.string().email().optional(),
});

const getSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const { createClient } = require("@supabase/supabase-js");
  return createClient(supabaseUrl, supabaseKey);
};

export const createVenue = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => venueInput.parse(d))
  .handler(async ({ data, request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) throw new Error("Unauthorized");
    const token = authHeader.replace("Bearer ", "");
    const sb = getSupabase();
    const { data: user } = await sb.auth.getUser(token);
    if (!user.user) throw new Error("Unauthorized");

    const { data: row, error } = await supabase
      .from("venues")
      .insert({ ...data, owner_id: user.user.id, status: "pending" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const myVenues = createServerFn({ method: "GET" })
  .handler(async ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) throw new Error("Unauthorized");
    const token = authHeader.replace("Bearer ", "");
    const sb = getSupabase();
    const { data: user } = await sb.auth.getUser(token);
    if (!user.user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .eq("owner_id", user.user.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
