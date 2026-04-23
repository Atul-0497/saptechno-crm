import { z } from "zod";

// --- Common Fields ---
const activeSchema = z.union([z.string(), z.boolean()]);

// --- Master Schemas ---

// 1. Company Schema
export const CompanySchema = z.object({
  Name: z.string().min(1, "Company name is required"),
  Email: z.string().email("Invalid email address").or(z.literal("")),
  Mobile: z.string().min(10, "Mobile number must be at least 10 digits").or(z.literal("")),
  Website: z.string().url("Invalid website URL").or(z.literal("")),
  PlanStart: z.string().min(1, "Plan start date is required"),
  PlanEnd: z.string().min(1, "Plan end date is required"),
  Address: z.string().min(1, "Address is required"),
  Pincode: z.string().optional(),
  Active: activeSchema,
}).refine((data) => {
  if (data.PlanStart && data.PlanEnd) {
    return new Date(data.PlanEnd) >= new Date(data.PlanStart);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["PlanEnd"],
});

// 2. Department Schema
export const DepartmentSchema = z.object({
  DepartmentName: z.string().min(1, "Department name is required"),
  DepartmentCode: z.string().min(1, "Department code is required"),
  Active: activeSchema,
});

// 3. Designation Schema
export const DesignationSchema = z.object({
  DesignationName: z.string().min(1, "Designation name is required"),
  DesignationLevel: z.string().min(1, "Level/Rank is required"),
  Active: activeSchema,
});

// 4. Employee Schema
export const EmployeeSchema = z.object({
  FirstName: z.string().min(1, "First name is required"),
  LastName: z.string().min(1, "Last name is required"),
  EmployeeCode: z.string().min(1, "Employee code is required"),
  JoiningDate: z.string().min(1, "Joining date is required"),
  EmailId: z.string().email("Invalid email address").or(z.literal("")),
  MobileNo: z.string().min(10, "Mobile number must be at least 10 digits").or(z.literal("")),
  DepartmentId: z.string().min(1, "Department is required"),
  DesignationId: z.string().min(1, "Designation is required"),
  ReportingTo: z.string(),
  Password: z.string().min(6, "Password must be at least 6 characters").or(z.literal("")),
  Active: activeSchema,
});

// 5. Vendor Schema
export const VendorSchema = z.object({
  VendorName: z.string().min(1, "Vendor name is required"),
  Email: z.string().email("Invalid email address").or(z.literal("")),
  Mobile: z.string().min(10, "Mobile number must be at least 10 digits").or(z.literal("")),
  Address: z.string().min(1, "Address is required"),
  CityId: z.string().min(1, "City is required"),
  Pincode: z.string().optional(),
  Active: activeSchema,
});

// 6. Dealer Schema
export const DealerSchema = z.object({
  DealerName: z.string().min(1, "Dealer name is required"),
  Email: z.string().email("Invalid email address").or(z.literal("")),
  Mobile: z.string().min(10, "Mobile number must be at least 10 digits").or(z.literal("")),
  Address: z.string().min(1, "Address is required"),
  CityId: z.string().min(1, "City is required"),
  Pincode: z.string().optional(),
  Active: activeSchema,
});

export const ProductSchema = z.object({
  Name: z.string().min(1, "Product name is required"),
  Code: z.string().min(1, "Product code is required"),
  Active: activeSchema,
  // Price Information
  UnitPrice: z.union([z.string(), z.number()]).optional(),
  Tax: z.string().optional(),
  IsTaxable: z.boolean().optional().default(false),
  // Stock Information
  Unit: z.string().optional(),
  StockQty: z.union([z.string(), z.number()]).optional(),
  // Description Information
  Description: z.string().optional(),
  OtherInfoJson: z.string().optional(), // Flexible JSON data
});

// 8. Lead Source Schema
export const LeadSourceSchema = z.object({
  SourceName: z.string().min(1, "Source name is required"),
  Active: activeSchema,
});

// 9. Industry Schema
export const IndustrySchema = z.object({
  IndustryName: z.string().min(1, "Industry name is required"),
  Active: activeSchema,
});

// 10. Country Schema
export const CountrySchema = z.object({
  CountryName: z.string().min(1, "Country name is required"),
  CountryCode: z.string().min(1, "Country code is required"),
  Active: activeSchema,
});

// 11. Pincode Schema
export const PincodeSchema = z.object({
  Pincode: z.string().min(5, "Postal code must be at least 5 characters"),
  CityId: z.string().min(1, "City is required"),
  StateId: z.string().min(1, "State is required"),
  CountryId: z.string().min(1, "Country is required"),
  Active: activeSchema,
});

// 12. State Schema
export const StateSchema = z.object({
  StateName: z.string().min(1, "State name is required"),
  CountryId: z.string().min(1, "Country is required"),
  Active: activeSchema,
});

// 13. City Schema
export const CitySchema = z.object({
  CityName: z.string().min(1, "City name is required"),
  StateId: z.string().min(1, "State is required"),
  Active: activeSchema,
});

// 14. Location Schema (Generic)
export const LocationSchema = z.object({
  LocationName: z.string().min(1, "Location name is required"),
  LocationCode: z.string().optional(),
  Active: activeSchema,
});

export const QuoteItemSchema = z.object({
  productName: z.string().optional(),
  quantity: z.union([z.string(), z.number()]).optional(),
  listPrice: z.union([z.string(), z.number()]).optional(),
  amount: z.union([z.string(), z.number()]).optional(),
  discount: z.union([z.string(), z.number()]).optional(),
  tax: z.union([z.string(), z.number()]).optional(),
  description: z.string().optional(),
});

export const QuoteSchema = z.object({
  QuoteTitle: z.string().min(1, "Quote title is required"),
  QuoteNumber: z.string().min(1, "Quote number is required"),
  VendorId: z.string().min(1, "Vendor is required"),
  QuoteDate: z.string().min(1, "Quote date is required"),
  ValidUntil: z.string().min(1, "Valid until date is required"),
  Status: z.string().min(1, "Status is required"),
  BillingCountry: z.string().optional(),
  BillingFlat: z.string().optional(),
  BillingStreet: z.string().optional(),
  BillingCity: z.string().optional(),
  BillingState: z.string().optional(),
  BillingPostalCode: z.string().optional(),
  BillingLatitude: z.string().optional(),
  BillingLongitude: z.string().optional(),
  ShippingCountry: z.string().optional(),
  ShippingFlat: z.string().optional(),
  ShippingStreet: z.string().optional(),
  ShippingCity: z.string().optional(),
  ShippingState: z.string().optional(),
  ShippingPostalCode: z.string().optional(),
  ShippingLatitude: z.string().optional(),
  ShippingLongitude: z.string().optional(),
  QuotedItems: z.array(QuoteItemSchema).min(1, "At least one quoted item is required"),
  SubTotal: z.union([z.string(), z.number()]).optional(),
  Discount: z.union([z.string(), z.number()]).optional(),
  Tax: z.union([z.string(), z.number()]).optional(),
  Adjustment: z.union([z.string(), z.number()]).optional(),
  GrandTotal: z.union([z.string(), z.number()]).optional(),
  TermsAndConditions: z.string().optional(),
  Description: z.string().optional(),
});

export const PurchaseOrderItemSchema = z.object({
  productName: z.string().optional(),
  quantity: z.union([z.string(), z.number()]).optional(),
  listPrice: z.union([z.string(), z.number()]).optional(),
  amount: z.union([z.string(), z.number()]).optional(),
  discount: z.union([z.string(), z.number()]).optional(),
  tax: z.union([z.string(), z.number()]).optional(),
  description: z.string().optional(),
});

export const PurchaseOrderSchema = z.object({
  PurchaseTitle: z.string().min(1, "Purchase title is required"),
  PurchaseNumber: z.string().min(1, "Purchase number is required"),
  VendorId: z.string().min(1, "Vendor is required"),
  PurchaseDate: z.string().min(1, "Purchase date is required"),
  ExpectedDeliveryDate: z.string().min(1, "Expected delivery date is required"),
  Status: z.string().min(1, "Status is required"),
  ReferenceNumber: z.string().optional(),
  PaymentTerms: z.string().optional(),
  BillingCountry: z.string().optional(),
  BillingFlat: z.string().optional(),
  BillingStreet: z.string().optional(),
  BillingCity: z.string().optional(),
  BillingState: z.string().optional(),
  BillingPostalCode: z.string().optional(),
  BillingLatitude: z.string().optional(),
  BillingLongitude: z.string().optional(),
  ShippingCountry: z.string().optional(),
  ShippingFlat: z.string().optional(),
  ShippingStreet: z.string().optional(),
  ShippingCity: z.string().optional(),
  ShippingState: z.string().optional(),
  ShippingPostalCode: z.string().optional(),
  ShippingLatitude: z.string().optional(),
  ShippingLongitude: z.string().optional(),
  OrderedItems: z.array(PurchaseOrderItemSchema).min(1, "At least one ordered item is required"),
  SubTotal: z.union([z.string(), z.number()]).optional(),
  Discount: z.union([z.string(), z.number()]).optional(),
  Tax: z.union([z.string(), z.number()]).optional(),
  Adjustment: z.union([z.string(), z.number()]).optional(),
  GrandTotal: z.union([z.string(), z.number()]).optional(),
  TermsAndConditions: z.string().optional(),
  Description: z.string().optional(),
});

// --- Types ---
export type CompanyFormData = z.infer<typeof CompanySchema>;
export type DepartmentFormData = z.infer<typeof DepartmentSchema>;
export type DesignationFormData = z.infer<typeof DesignationSchema>;
export type EmployeeFormData = z.infer<typeof EmployeeSchema>;
export type VendorFormData = z.infer<typeof VendorSchema>;
export type DealerFormData = z.infer<typeof DealerSchema>;
export type ProductFormData = z.infer<typeof ProductSchema>;
export type LeadSourceFormData = z.infer<typeof LeadSourceSchema>;
export type IndustryFormData = z.infer<typeof IndustrySchema>;
export type CountryFormData = z.infer<typeof CountrySchema>;
export type StateFormData = z.infer<typeof StateSchema>;
export type CityFormData = z.infer<typeof CitySchema>;
export type PincodeFormData = z.infer<typeof PincodeSchema>;
export type LocationFormData = z.infer<typeof LocationSchema>;
export type QuoteFormData = z.infer<typeof QuoteSchema>;
export type PurchaseOrderFormData = z.infer<typeof PurchaseOrderSchema>;
