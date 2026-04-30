import { z } from "zod";

export const pincodeSchema = z.object({
  PincodeId: z.string().optional(),
  Pincode: z.string().min(3, "Pincode is required"),
  CityId: z.string().optional(),
  StateId: z.string().optional(),
  CountryId: z.string().optional(),
  Active: z.enum(["0", "1"]).optional(),
});

export type PincodeForm = z.infer<typeof pincodeSchema>;
