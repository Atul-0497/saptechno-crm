import { z } from "zod";

export const employeeSchema = z.object({
  EmployeeId: z.string().optional(),
  FirstName: z.string().min(1, "First name is required").optional(),
  LastName: z.string().optional(),
  Name: z.string().optional(),
  EmailId: z.string().email("Invalid email").optional(),
  MobileNo: z.string().min(10, "Mobile must be at least 10 digits").optional(),
  DepartmentId: z.string().optional(),
  DesignationId: z.string().optional(),
  JoiningDate: z.string().optional(),
  Active: z.enum(["0", "1"]).optional(),
});

export type EmployeeForm = z.infer<typeof employeeSchema>;
