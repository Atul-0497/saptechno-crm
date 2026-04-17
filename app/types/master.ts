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
  ProductName?: string;
  Name?: string;
  ProductCode?: string;
  Price?: number | string;
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

// For generic tables like SimpleMasterPage
export interface SimpleMasterRecord extends BaseMasterRecord {
  Id: string;
  Name: string;
  Code?: string;
  Level?: string;
}

export type SimpleMasterFormValues = Partial<SimpleMasterRecord>;
export type EmployeeFormValues     = Partial<EmployeeRecord>;
export type VendorFormValues       = Partial<VendorRecord>;
export type ProductFormValues      = Partial<ProductRecord>;
export type DealerFormValues       = Partial<DealerRecord>;
export type LeadSourceFormValues   = Partial<LeadSourceRecord>;
export type IndustryFormValues     = Partial<IndustryRecord>;
export type CountryFormValues      = Partial<CountryRecord>;
export type StateFormValues        = Partial<StateRecord>;
export type CityFormValues         = Partial<CityRecord>;

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
  | "company";
