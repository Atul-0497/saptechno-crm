import { z } from "zod";

export const companySchema = z.object({
  CompanyId: z.string().optional(),

  Name: z.string().min(3, "Name must be at least 3 characters"),

  Address: z.string().optional(),

  Email: z.string().email("Invalid email"),

  Mobile: z.string().min(10, "Mobile must be at least 10 digits"),

  PlanStart: z.string().optional(),

  PlanEnd: z.string().optional(),

  Active: z.enum(["0", "1"]),
});

export type CompanyForm = z.infer<typeof companySchema>;