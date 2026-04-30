import { z } from "zod";

export const stateSchema = z.object({
  StateId: z.string().optional(),
  CountryId: z.string().optional(),
  StateName: z.string().min(1, "State name is required"),
  Active: z.enum(["0", "1"]).optional(),
});

export type StateForm = z.infer<typeof stateSchema>;
