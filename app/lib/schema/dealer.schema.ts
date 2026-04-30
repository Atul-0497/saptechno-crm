import { z } from "zod";

export const dealerSchema = z.object({
  DealerId: z.string().optional(),
  DealerName: z.string().min(1, "Dealer name is required"),
  Email: z.string().email("Invalid email").optional(),
  Mobile: z.string().min(10, "Mobile must be at least 10 digits").optional(),
  Address: z.string().optional(),
  CityId: z.string().optional(),
  Active: z.enum(["0", "1"]).optional(),
});

export type DealerForm = z.infer<typeof dealerSchema>;
