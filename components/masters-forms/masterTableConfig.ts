import type { ColumnConfig } from "@/components/tables/UniversalTable";

export const masterIdKeys = {
  company: "CompanyId",
  department: "DepartmentId",
  designation: "DesignationId",
  employee: "EmployeeId",
  vendor: "VendorId",
  dealer: "DealerId",
  product: "ProductId",
  leadsource: "LeadSourceId",
  industry: "IndustryId",
  country: "CountryId",
  state: "StateId",
  city: "CityId",
  pincode: "PincodeId",
} as const;

export const masterTableColumns = {
  company: [
    { key: "Name", label: "Company" },
    { key: "Email", label: "Email" },
    { key: "Mobile", label: "Mobile" },
    { key: "Active", label: "Status", type: "status" },
  ],
  department: [
    { key: "DepartmentName", label: "Department" },
    { key: "DepartmentCode", label: "Code" },
    { key: "Active", label: "Status", type: "status" },
  ],
  designation: [
    { key: "DesignationName", label: "Designation" },
    { key: "DesignationLevel", label: "Level" },
    { key: "Active", label: "Status", type: "status" },
  ],
  employee: [
    { key: "FirstName", label: "First Name" },
    { key: "LastName", label: "Last Name" },
    { key: "EmployeeCode", label: "Code" },
    { key: "EmailId", label: "Email" },
    { key: "Active", label: "Status", type: "status" },
  ],
  vendor: [
    { key: "VendorName", label: "Vendor" },
    { key: "Email", label: "Email" },
    { key: "Mobile", label: "Mobile" },
    { key: "Active", label: "Status", type: "status" },
  ],
  dealer: [
    { key: "DealerName", label: "Dealer" },
    { key: "Email", label: "Email" },
    { key: "Mobile", label: "Mobile" },
    { key: "Active", label: "Status", type: "status" },
  ],
  product: [
    { key: "Name", label: "Product" },
    { key: "Code", label: "Code" },
    { key: "Active", label: "Status", type: "status" },
  ],
  leadsource: [
    { key: "SourceName", label: "Lead Source" },
    { key: "Active", label: "Status", type: "status" },
  ],
  industry: [
    { key: "IndustryName", label: "Industry" },
    { key: "Active", label: "Status", type: "status" },
  ],
  country: [
    { key: "CountryName", label: "Country" },
    { key: "CountryCode", label: "Code" },
    { key: "Active", label: "Status", type: "status" },
  ],
  state: [
    { key: "StateName", label: "State" },
    { key: "CountryId", label: "Country" },
    { key: "Active", label: "Status", type: "status" },
  ],
  city: [
    { key: "CityName", label: "City" },
    { key: "StateId", label: "State" },
    { key: "Active", label: "Status", type: "status" },
  ],
  pincode: [
    { key: "Pincode", label: "Pincode" },
    { key: "CityId", label: "City" },
    { key: "StateId", label: "State" },
    { key: "CountryId", label: "Country" },
    { key: "Active", label: "Status", type: "status" },
  ],
  quote: [
    { key: "QuoteTitle", label: "Quote" },
    { key: "QuoteNumber", label: "Number" },
    { key: "Status", label: "Status" },
    { key: "GrandTotal", label: "Total" },
  ],
  purchaseOrder: [
    { key: "PurchaseTitle", label: "Order" },
    { key: "PurchaseNumber", label: "Number" },
    { key: "Status", label: "Status" },
    { key: "GrandTotal", label: "Total" },
  ],
} satisfies Record<string, ColumnConfig[]>;
