import { z } from "zod";

export const leadSourceSchema = z.object({
  LeadSourceId: z.string().optional(),
  SourceName: z.string().min(1, "Source name is required"),
  Active: z.enum(["0", "1"]).optional(),
});

export type LeadSourceForm = z.infer<typeof leadSourceSchema>;
