import { z } from "zod";

export const productSchema = z.object({
  ProductId: z.string().optional(),
  Name: z.string().min(1, "Product name is required"),
  Code: z.string().optional(),
  OtherInfoJson: z.string().optional(),
  Active: z.enum(["0", "1"]).optional(),
});

export type ProductForm = z.infer<typeof productSchema>;
