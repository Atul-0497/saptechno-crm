import { z } from "zod";

export const industrySchema = z.object({
  IndustryId: z.string().optional(),
  IndustryName: z.string().min(1, "Industry name is required"),
  Active: z.enum(["0", "1"]).optional(),
});

export type IndustryForm = z.infer<typeof industrySchema>;
