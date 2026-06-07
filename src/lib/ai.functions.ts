import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({
  eventType: z.string().min(1).max(50),
  guests: z.number().int().min(10).max(5000),
  city: z.string().min(1).max(80),
  budget: z.number().int().min(10000).max(10000000).optional(),
  catering: z.enum(["veg", "non-veg", "mixed", "none"]).default("veg"),
  decoration: z.enum(["basic", "premium", "luxury", "none"]).default("basic"),
});

const PER_PLATE: Record<string, number> = { veg: 650, "non-veg": 850, mixed: 750, none: 0 };
const DECO_MULT: Record<string, number> = { basic: 1, premium: 1.5, luxury: 2.5, none: 0 };
const CITY_MULT: Record<string, number> = { Hyderabad: 1.2, Vijayawada: 0.9, Visakhapatnam: 0.85, Tirupati: 0.8 };

export const estimateEventCost = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data }) => {
    const plate = PER_PLATE[data.catering] ?? 650;
    const deco = DECO_MULT[data.decoration] ?? 1;
    const city = CITY_MULT[data.city] ?? 1;
    const g = data.guests;

    const venueRent = Math.round(g * 350 * city);
    const catering = Math.round(plate * g);
    const decoration = Math.round(g * 300 * deco);
    const photography = Math.round(g * 120 * city);
    const musicDj = Math.round(g * 80 * city);
    const misc = Math.round(g * 100);
    const total = venueRent + catering + decoration + photography + musicDj + misc;

    return {
      venue_rent: venueRent,
      catering,
      decoration,
      photography,
      music_dj: musicDj,
      misc,
      total,
      notes: "Book early and negotiate package deals to save up to 15%.",
    };
  });
