import { z } from "zod";

export const designationSchema = z.object({
  DesignationId: z.string().optional(),
  DesignationName: z.string().min(1, "Designation name is required"),
  DesignationLevel: z.string().optional(),
  Active: z.enum(["0", "1"]).optional(),
});

export type DesignationForm = z.infer<typeof designationSchema>;
