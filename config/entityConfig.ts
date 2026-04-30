"use client";

/**
 * ENTITY CONFIG — Central Brain 🧠
 *
 * Each entity defines:
 *  - fields[]       : form field config (name, label, type, required, etc.)
 *  - sections[]     : how fields are grouped (maps to FormSectionConfig)
 *  - tableColumns[] : columns for UniversalTable
 *  - transform?     : optional payload transformer before API submit
 *
 * For select fields, pass `useOptions` — a React hook that returns
 * the list of {label, value} options. This keeps loading declarative.
 */

import type { FormSectionConfig } from "@/components/forms/UniversalForm";
import type { ColumnConfig } from "@/components/tables/UniversalTable";

export interface EntityDefinition {
  sections: FormSectionConfig[];
  tableColumns: ColumnConfig[];
  /** Optional: transform form data before submitting to the API */
  transform?: (data: Record<string, any>) => Record<string, any>;
  /** API endpoint keys (matches mastersAPI key names) */
  apiKey: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENT
// ─────────────────────────────────────────────────────────────────────────────
export const departmentConfig: EntityDefinition = {
  apiKey: "department",
  sections: [
    {
      title: "Department Details",
      subtitle: "Organizational unit information",
      fields: [
        { name: "DepartmentName", label: "Department Name", type: "text", required: true, colSpan: 2, placeholder: "e.g. Engineering, Sales, HR" },
        { name: "DepartmentCode", label: "Department Code", type: "text", required: true, placeholder: "ENG-001" },
        {
          name: "Active", label: "Status", type: "select",
          options: [{ label: "Active", value: "1" }, { label: "Inactive", value: "0" }],
        },
      ],
    },
  ],
  tableColumns: [
    { key: "DepartmentName", label: "Department" },
    { key: "DepartmentCode", label: "Code" },
    { key: "Active", label: "Status", type: "status" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// DESIGNATION
// ─────────────────────────────────────────────────────────────────────────────
export const designationConfig: EntityDefinition = {
  apiKey: "designation",
  sections: [
    {
      title: "Designation Details",
      subtitle: "Define job title and seniority level",
      fields: [
        { name: "DesignationName", label: "Designation Title", type: "text", required: true, colSpan: 2, placeholder: "e.g. Senior Engineer, Sales Lead" },
        { name: "DesignationLevel", label: "Seniority Level", type: "text", required: true, placeholder: "L1, L2, Manager..." },
        {
          name: "Active", label: "Status", type: "select",
          options: [{ label: "Active", value: "1" }, { label: "Inactive", value: "0" }],
        },
      ],
    },
  ],
  tableColumns: [
    { key: "DesignationName", label: "Designation" },
    { key: "DesignationLevel", label: "Level" },
    { key: "Active", label: "Status", type: "status" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT
// ─────────────────────────────────────────────────────────────────────────────
export const productConfig: EntityDefinition = {
  apiKey: "product",
  sections: [
    {
      title: "Essential Details",
      subtitle: "Basic identification for your product master catalog",
      fields: [
        { name: "Name", label: "Product Display Name", type: "text", required: true, colSpan: 2, placeholder: "e.g. Dell Latitude 7420, Platinum License" },
        { name: "Code", label: "Product SKU / Code", type: "text", required: true, placeholder: "PRD-001X" },
        { name: "Category", label: "Product Category", type: "text", placeholder: "Hardware, Services, Software..." },
      ],
    },
    {
      title: "Inventory & Pricing",
      subtitle: "Standard market rates and unit specifications",
      fields: [
        { name: "Price", label: "Standard MSRP (₹)", type: "number", placeholder: "0.00", required: true },
        { name: "Unit", label: "Unit of Measure", type: "text", placeholder: "pcs, unit, kg, user/month" },
        { name: "Description", label: "Product Specification", type: "textarea", colSpan: 2, placeholder: "Detailed specs or internal notes..." },
      ],
    },
    {
      title: "Lifecycle Status",
      subtitle: "Control visibility and availability",
      fields: [
        {
          name: "Active", label: "Master Status", type: "select", colSpan: 2,
          options: [{ label: "Active & Available", value: "1" }, { label: "Retired / Off-catalog", value: "0" }],
        },
      ],
    },
  ],
  tableColumns: [
    { key: "Name", label: "Product" },
    { key: "Code", label: "SKU" },
    { key: "Active", label: "Status", type: "status" },
  ],
  transform: (data) => ({
    Name: data.Name,
    Code: data.Code,
    Active: data.Active,
    OtherInfoJson: JSON.stringify({
      price: data.Price,
      unit: data.Unit,
      category: data.Category,
      description: data.Description,
    }),
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY
// ─────────────────────────────────────────────────────────────────────────────
export const companyConfig: EntityDefinition = {
  apiKey: "company",
  sections: [
    {
      title: "Company Details",
      subtitle: "Tenant profile and contact information",
      fields: [
        { name: "CompanyId", label: "Company ID", type: "text", placeholder: "Auto-generated", required: false },
        { name: "Name", label: "Company Name", type: "text", required: true, colSpan: 2, placeholder: "e.g. Acme Corp" },
        { name: "Email", label: "Email", type: "email", placeholder: "contact@example.com" },
        { name: "Mobile", label: "Mobile", type: "text", placeholder: "+91 98765 43210" },
        { name: "Website", label: "Website", type: "text", placeholder: "https://example.com" },
        { name: "Address", label: "Address", type: "textarea", colSpan: 2, placeholder: "Street, City, State, Pincode" },
        { name: "PlanStart", label: "Plan Start", type: "date" },
        { name: "PlanEnd", label: "Plan End", type: "date" },
        { name: "Active", label: "Status", type: "select", options: [{ label: "Active", value: "1" }, { label: "Inactive", value: "0" }] },
      ],
    },
  ],
  tableColumns: [
    { key: "Name", label: "Company" },
    { key: "Email", label: "Email" },
    { key: "Mobile", label: "Mobile" },
    { key: "Active", label: "Status", type: "status" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LEAD SOURCE
// ─────────────────────────────────────────────────────────────────────────────
export const leadSourceConfig: EntityDefinition = {
  apiKey: "leadsource",
  sections: [
    {
      title: "Lead Source Details",
      subtitle: "Define where leads are originating from",
      fields: [
        { name: "SourceName", label: "Source Name", type: "text", required: true, colSpan: 2, placeholder: "e.g. Website, Cold Call, Referral" },
        {
          name: "Active", label: "Status", type: "select",
          options: [{ label: "Active", value: "1" }, { label: "Inactive", value: "0" }],
        },
      ],
    },
  ],
  tableColumns: [
    { key: "SourceName", label: "Source" },
    { key: "Active", label: "Status", type: "status" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// INDUSTRY
// ─────────────────────────────────────────────────────────────────────────────
export const industryConfig: EntityDefinition = {
  apiKey: "industry",
  sections: [
    {
      title: "Industry Details",
      subtitle: "Define the industry sector",
      fields: [
        { name: "IndustryName", label: "Industry Name", type: "text", required: true, colSpan: 2, placeholder: "e.g. Manufacturing, IT, Healthcare" },
        {
          name: "Active", label: "Status", type: "select",
          options: [{ label: "Active", value: "1" }, { label: "Inactive", value: "0" }],
        },
      ],
    },
  ],
  tableColumns: [
    { key: "IndustryName", label: "Industry" },
    { key: "Active", label: "Status", type: "status" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VENDOR
// ─────────────────────────────────────────────────────────────────────────────
export const vendorConfig: EntityDefinition = {
  apiKey: "vendor",
  sections: [
    {
      title: "Vendor Information",
      subtitle: "Supplier contact and identification details",
      fields: [
        { name: "VendorName", label: "Vendor / Supplier Name", type: "text", required: true, colSpan: 2, placeholder: "Acme Supplies Pvt. Ltd." },
        { name: "Email", label: "Email Address", type: "email", placeholder: "vendor@example.com" },
        { name: "Mobile", label: "Mobile Number", type: "text", placeholder: "+91 98765 43210" },
      ],
    },
    {
      title: "Location Details",
      subtitle: "Registered address and area",
      fields: [
        { name: "Address", label: "Full Address", type: "textarea", required: true, colSpan: 2, placeholder: "Building, Street, Area..." },
        { name: "Pincode", label: "Pincode", type: "text", placeholder: "400001" },
        {
          name: "Active", label: "Status", type: "select",
          options: [{ label: "Active", value: "1" }, { label: "Inactive", value: "0" }],
        },
      ],
    },
  ],
  tableColumns: [
    { key: "VendorName", label: "Vendor" },
    { key: "Email", label: "Email" },
    { key: "Mobile", label: "Mobile" },
    { key: "Active", label: "Status", type: "status" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// DEALER
// ─────────────────────────────────────────────────────────────────────────────
export const dealerConfig: EntityDefinition = {
  apiKey: "dealer",
  sections: [
    {
      title: "Dealer Information",
      subtitle: "Channel partner contact and identification",
      fields: [
        { name: "DealerName", label: "Dealer Name", type: "text", required: true, colSpan: 2, placeholder: "e.g. TechVision Sales" },
        { name: "Email", label: "Email Address", type: "email", placeholder: "dealer@example.com" },
        { name: "Mobile", label: "Mobile Number", type: "text", placeholder: "+91 98765 43210" },
      ],
    },
    {
      title: "Location",
      subtitle: "Dealer address and registered area",
      fields: [
        { name: "Address", label: "Full Address", type: "textarea", required: true, colSpan: 2, placeholder: "Building, Street, Area..." },
        { name: "Pincode", label: "Pincode", type: "text", placeholder: "400001" },
        {
          name: "Active", label: "Status", type: "select",
          options: [{ label: "Active", value: "1" }, { label: "Inactive", value: "0" }],
        },
      ],
    },
  ],
  tableColumns: [
    { key: "DealerName", label: "Dealer" },
    { key: "Email", label: "Email" },
    { key: "Mobile", label: "Mobile" },
    { key: "Active", label: "Status", type: "status" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// COUNTRY
// ─────────────────────────────────────────────────────────────────────────────
export const countryConfig: EntityDefinition = {
  apiKey: "country",
  sections: [
    {
      title: "Country Details",
      subtitle: "Geographic location setup",
      fields: [
        { name: "CountryName", label: "Country Name", type: "text", required: true, colSpan: 2, placeholder: "e.g. India, United States" },
        { name: "CountryCode", label: "Country Code", type: "text", required: true, placeholder: "IN, US, GB" },
        {
          name: "Active", label: "Status", type: "select",
          options: [{ label: "Active", value: "1" }, { label: "Inactive", value: "0" }],
        },
      ],
    },
  ],
  tableColumns: [
    { key: "CountryName", label: "Country" },
    { key: "CountryCode", label: "Code" },
    { key: "Active", label: "Status", type: "status" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ENTITY REGISTRY — lookup by key
// ─────────────────────────────────────────────────────────────────────────────
export const entityRegistry: Record<string, EntityDefinition> = {
  company: companyConfig,
  department: departmentConfig,
  designation: designationConfig,
  product: productConfig,
  leadsource: leadSourceConfig,
  industry: industryConfig,
  vendor: vendorConfig,
  dealer: dealerConfig,
  country: countryConfig,
};
