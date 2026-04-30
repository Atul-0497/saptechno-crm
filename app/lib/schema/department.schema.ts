import { z } from "zod";

export const departmentSchema = z.object({
  DepartmentId: z.string().optional(),
  DepartmentName: z.string().min(1, "Department name is required"),
  DepartmentCode: z.string().optional(),
  Active: z.enum(["0", "1"]).optional(),
});

export type DepartmentForm = z.infer<typeof departmentSchema>;
