import { z } from "zod";

export const citySchema = z.object({
  CityId: z.string().optional(),
  StateId: z.string().optional(),
  CityName: z.string().min(1, "City name is required"),
  Active: z.enum(["0", "1"]).optional(),
});

export type CityForm = z.infer<typeof citySchema>;
