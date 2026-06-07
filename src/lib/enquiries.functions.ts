import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const enquiryInput = z.object({
  venue_id: z.string().uuid(),
  event_date: z.string().min(1),
  guest_count: z.number().int().min(1).max(10000),
  event_type: z.string().min(1).max(50),
  message: z.string().max(2000).optional(),
  contact_phone: z.string().min(5).max(20),
});

const getSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const { createClient } = require("@supabase/supabase-js");
  return createClient(supabaseUrl, supabaseKey);
};

export const createEnquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => enquiryInput.parse(d))
  .handler(async ({ data, request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) throw new Error("Unauthorized");
    const token = authHeader.replace("Bearer ", "");
    const sb = getSupabase();
    const { data: user } = await sb.auth.getUser(token);
    if (!user.user) throw new Error("Unauthorized");

    const sbAuth = getSupabase();
    const { data: row, error } = await sbAuth
      .from("enquiries")
      .insert({ ...data, customer_id: user.user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const myEnquiries = createServerFn({ method: "GET" })
  .handler(async ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) throw new Error("Unauthorized");
    const token = authHeader.replace("Bearer ", "");
    const sb = getSupabase();
    const { data: user } = await sb.auth.getUser(token);
    if (!user.user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("enquiries")
      .select("*, venues(name, slug, city, cover_image)")
      .eq("customer_id", user.user.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const ownerEnquiries = createServerFn({ method: "GET" })
  .handler(async ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) throw new Error("Unauthorized");
    const token = authHeader.replace("Bearer ", "");
    const sb = getSupabase();
    const { data: user } = await sb.auth.getUser(token);
    if (!user.user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("enquiries")
      .select("*, venues!inner(name, slug, owner_id, city, cover_image)")
      .eq("venues.owner_id", user.user.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateEnquiryStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "accepted", "rejected", "cancelled"]),
      response: z.string().max(2000).optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { error } = await supabase
      .from("enquiries")
      .update({ status: data.status, owner_response: data.response ?? null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
