export type ActiveValue = "1" | "0" | true | false;

export interface BaseMasterRecord {
  CompanyId?: string;
  Active?: ActiveValue;
  CreatedDate?: string;
  UpdatedDate?: string;
}

// 1. Company Master
export interface CompanyRecord extends BaseMasterRecord {
  Id?: string;
  CompanyId: string;
  Name: string;
  CompanyName?: string; // Standardize on Name, keeping CompanyName as optional fallback if needed
  Email?: string;
  Mobile?: string;
  Website?: string;
  PlanStart?: string;
  PlanEnd?: string;
  PlanStartDate?: string; // Keeping for compatibility
  PlanEndDate?: string;   // Keeping for compatibility
  Address?: string;
}

export type CompanyPayload = {
  CompanyId: string;
  Name: string;
  Address: string;
  Email: string;
  Mobile: string;
  Website: string;
  PlanStart: string;
  PlanEnd: string;
  Active: ActiveValue;
};

export type CompanyFormValues = Omit<Partial<CompanyRecord>, "Active"> & {
  Active?: string | boolean;
};


// 2. Department Master
export interface DepartmentRecord extends BaseMasterRecord {
  Id?: string; // Fallback for generic generic mappers
  DepartmentId?: string;
  DepartmentName?: string;
  Name?: string; // Fallback
  DepartmentCode?: string;
}

// 3. Designation Master
export interface DesignationRecord extends BaseMasterRecord {
  Id?: string; // Fallback for generic mappers
  DesignationId?: string;
  DesignationName?: string;
  Name?: string; // Fallback
  DesignationLevel?: string;
}

// 4. Employee Master
export interface EmployeeRecord extends BaseMasterRecord {
  Id?: string; // Fallback mappings
  EmployeeId?: string;
  FirstName?: string;
  LastName?: string;
  Name?: string; // Fallback Name
  EmailId?: string;
  MobileNo?: string;
  DepartmentId?: string;
  DesignationId?: string;
  ReportingTo?: string; // FK to EmployeeId
  PasswordHash?: string;
  Password?: string;
  EmployeeCode?: string;
  JoiningDate?: string;
  DepartmentName?: string;
  DesignationName?: string;
  Department?: string;
  Designation?: string;
}

// 5. Vendor Master
export interface VendorRecord extends BaseMasterRecord {
  Id?: string;
  VendorId?: string;
  VendorName?: string;
  Name?: string;
  Email?: string;
  Mobile?: string;
  Address?: string;
  CityId?: string;
}

// 6. Product Master
export interface ProductRecord extends BaseMasterRecord {
  Id?: string;
  ProductId?: string;
  Name?: string;
  Code?: string;
  OtherInfoJson?: string;
}

// 7. Dealer Master
export interface DealerRecord extends BaseMasterRecord {
  Id?: string;
  DealerId?: string;
  DealerName?: string;
  Name?: string;
  Email?: string;
  Mobile?: string;
  Address?: string;
  CityId?: string;
}

// 8. Lead Source Master
export interface LeadSourceRecord extends BaseMasterRecord {
  Id?: string;
  LeadSourceId?: string;
  SourceName?: string;
  Name?: string;
}

// 9. Industry Master
export interface IndustryRecord extends BaseMasterRecord {
  Id?: string;
  IndustryId?: string;
  IndustryName?: string;
  Name?: string;
}

// 10. Country Master
export interface CountryRecord {
  Id?: string;
  CountryId?: string;
  CountryName?: string;
  Name?: string;
  CountryCode?: string;
  Active?: ActiveValue;
}

// 11. State Master
export interface StateRecord {
  Id?: string;
  StateId?: string;
  CountryId?: string;
  StateName?: string;
  Name?: string;
  Active?: ActiveValue;
}

// 12. City Master
export interface CityRecord {
  Id?: string;
  CityId?: string;
  StateId?: string;
  CityName?: string;
  Name?: string;
  Active?: ActiveValue;
}

// 13. Pincode Master
export interface PincodeRecord extends BaseMasterRecord {
  Id?: string;
  PincodeId?: string;
  Pincode?: string;
  CityId?: string;
  StateId?: string;
  CountryId?: string;
  // Optional for UI display
  CityName?: string;
  StateName?: string;
  CountryName?: string;
}

// For generic tables like SimpleMasterPage
export interface SimpleMasterRecord extends BaseMasterRecord {
  Id: string;
  Name: string;
  Code?: string;
  Level?: string;
}

export type SimpleMasterFormValues = Omit<Partial<SimpleMasterRecord>, "Active"> & { Active?: string | boolean };
export type EmployeeFormValues     = Omit<Partial<EmployeeRecord>, "Active"> & { Active?: string | boolean };
export type VendorFormValues       = Omit<Partial<VendorRecord>, "Active"> & { Active?: string | boolean };
export type ProductFormValues = Omit<Partial<ProductRecord>, "Active"> & {
  Active?: string | boolean;
};
export type DealerFormValues       = Omit<Partial<DealerRecord>, "Active"> & { Active?: string | boolean };
export type LeadSourceFormValues   = Omit<Partial<LeadSourceRecord>, "Active"> & { Active?: string | boolean };
export type IndustryFormValues     = Omit<Partial<IndustryRecord>, "Active"> & { Active?: string | boolean };
export type CountryFormValues      = Omit<Partial<CountryRecord>, "Active"> & { Active?: string | boolean };
export type StateFormValues        = Omit<Partial<StateRecord>, "Active"> & { Active?: string | boolean };
export type CityFormValues         = Omit<Partial<CityRecord>, "Active"> & { Active?: string | boolean };
export type PincodeFormValues      = Omit<Partial<PincodeRecord>, "Active"> & { Active?: string | boolean };

// Union type covering all master table kinds
export type MasterKind =
  | "department"
  | "designation"
  | "employee"
  | "vendor"
  | "product"
  | "dealer"
  | "leadsource"
  | "industry"
  | "country"
  | "state"
  | "city"
  | "pincode"
  | "company";
