import { z } from "zod";

export const countrySchema = z.object({
  CountryId: z.string().optional(),
  CountryName: z.string().min(1, "Country name is required"),
  CountryCode: z.string().optional(),
  Active: z.enum(["0", "1"]).optional(),
});

export type CountryForm = z.infer<typeof countrySchema>;
