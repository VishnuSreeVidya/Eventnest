import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getGreeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().min(1) }))
  .handler(async ({ data }) => {
    return { greeting: `Hello, ${data.name}!` };
  });
