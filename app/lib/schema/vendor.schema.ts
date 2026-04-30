import { z } from "zod";

export const vendorSchema = z.object({
  VendorId: z.string().optional(),
  VendorName: z.string().min(1, "Vendor name is required"),
  Email: z.string().email("Invalid email").optional(),
  Mobile: z.string().min(10, "Mobile must be at least 10 digits").optional(),
  Address: z.string().optional(),
  CityId: z.string().optional(),
  Active: z.enum(["0", "1"]).optional(),
});

export type VendorForm = z.infer<typeof vendorSchema>;
