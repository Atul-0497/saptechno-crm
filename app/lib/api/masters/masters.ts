"use client";

import type {
  CityRecord,
  CompanyRecord,
  CountryRecord,
  DealerRecord,
  EmployeeRecord,
  IndustryRecord,
  LeadSourceRecord,
  ProductRecord,
  SimpleMasterRecord,
  StateRecord,
  VendorRecord,
} from "@/app/types/master";

const baseURL = "/api";
const REQUEST_TIMEOUT_MS = 30000;

// ─── Stored-procedure names ────────────────────────────────────────────────

const operationTypes = {
  department: {
    select: "SELECTDEPARTMENT",
    insert: "INSERTDEPARTMENT",
    update: "UPDATEDEPARTMENT",
    delete: "DELETEDEPARTMENT",
  },
  designation: {
    select: "SELECTDESIGNATION",
    insert: "INSERTDESIGNATION",
    update: "UPDATEDESIGNATION",
    delete: "DELETEDESIGNATION",
  },
  employee: {
    select: "SELECTEMPLOYEE",
    insert: "INSERTEMPLOYEE",
    update: "UPDATEEMPLOYEE",
    delete: "DELETEEMPLOYEE",
  },
  vendor: {
    select: "SELECTVENDOR",
    insert: "INSERTVENDOR",
    update: "UPDATEVENDOR",
    delete: "DELETEVENDOR",
  },
  product: {
    select: "SELECTPRODUCT",
    insert: "INSERTPRODUCT",
    update: "UPDATEPRODUCT",
    delete: "DELETEPRODUCT",
  },
  dealer: {
    select: "SELECTDEALER",
    insert: "INSERTDEALER",
    update: "UPDATEDEALER",
    delete: "DELETEDEALER",
  },
  leadsource: {
    select: "SELECTLEADSOURCE",
    insert: "INSERTLEADSOURCE",
    update: "UPDATELEADSOURCE",
    delete: "DELETELEADSOURCE",
  },
  industry: {
    select: "SELECTINDUSTRY",
    insert: "INSERTINDUSTRY",
    update: "UPDATEINDUSTRY",
    delete: "DELETEINDUSTRY",
  },
  country: {
    select: "SELECTCOUNTRY",
    insert: "INSERTCOUNTRY",
    update: "UPDATECOUNTRY",
    delete: "DELETECOUNTRY",
  },
  state: {
    select: "SELECTSTATE",
    insert: "INSERTSTATE",
    update: "UPDATESTATE",
    delete: "DELETESTATE",
  },
  city: {
    select: "SELECTCITY",
    insert: "INSERTCITY",
    update: "UPDATECITY",
    delete: "DELETECITY",
  },
  company: {
    select: "SELECTCOMPANY",
    insert: "INSERTCOMPANY",
    update: "UPDATECOMPANY",
    delete: "DELETECOMPANY",
  },
} as const;

// ─── Core fetch helper ─────────────────────────────────────────────────────

const request = async <T>(type: string, data?: Record<string, unknown>): Promise<T> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;

  try {
    res = await fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        inputdata: data ? JSON.stringify(data) : "{}",
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Master request timed out. Please try again.");
    }
    throw new Error("Unable to reach the local master API. Make sure the dev server is running.");
  } finally {
    window.clearTimeout(timeout);
  }

  const text = await res.text();
  let response: unknown = text;

  if (text) {
    try {
      response = JSON.parse(text);
    } catch {
      response = text;
    }
  }

  if (!res.ok) {
    const message =
      response &&
        typeof response === "object" &&
        "message" in response &&
        typeof response.message === "string"
        ? response.message
        : "Master request failed.";
    throw new Error(message);
  }

  if (typeof response === "string") {
    if (!response) return undefined as T;
    try {
      return JSON.parse(response) as T;
    } catch {
      return response as T;
    }
  }

  return response as T;
};

// ─── API ──────────────────────────────────────────────────────────────────

export const mastersAPI = {
  // ── Department ──────────────────────────────────────────────────────────
  getDepartments: () =>
    request<SimpleMasterRecord[]>(operationTypes.department.select, {}),

  createDepartment: (data: SimpleMasterRecord) =>
    request<unknown>(operationTypes.department.insert, { ...data }),

  updateDepartment: (data: SimpleMasterRecord) =>
    request<unknown>(operationTypes.department.update, { ...data }),

  deleteDepartment: (id: string) =>
    request<unknown>(operationTypes.department.delete, { DepartmentId: id }),

  // ── Designation ─────────────────────────────────────────────────────────
  getDesignations: () =>
    request<SimpleMasterRecord[]>(operationTypes.designation.select, {}),

  createDesignation: (data: SimpleMasterRecord) =>
    request<unknown>(operationTypes.designation.insert, { ...data }),

  updateDesignation: (data: SimpleMasterRecord) =>
    request<unknown>(operationTypes.designation.update, { ...data }),

  deleteDesignation: (id: string) =>
    request<unknown>(operationTypes.designation.delete, { DesignationId: id }),

  // ── Employee ─────────────────────────────────────────────────────────────
  getEmployees: () =>
    request<EmployeeRecord[]>(operationTypes.employee.select, {}),

  createEmployee: (data: EmployeeRecord) =>
    request<unknown>(operationTypes.employee.insert, { ...data }),

  updateEmployee: (data: EmployeeRecord) =>
    request<unknown>(operationTypes.employee.update, { ...data }),

  deleteEmployee: (id: string) =>
    request<unknown>(operationTypes.employee.delete, { EmployeeId: id }),

  // ── Vendor ───────────────────────────────────────────────────────────────
  getVendors: () =>
    request<VendorRecord[]>(operationTypes.vendor.select, {}),

  createVendor: (data: VendorRecord) =>
    request<unknown>(operationTypes.vendor.insert, { ...data }),

  updateVendor: (data: VendorRecord) =>
    request<unknown>(operationTypes.vendor.update, { ...data }),

  deleteVendor: (id: string) =>
    request<unknown>(operationTypes.vendor.delete, { VendorId: id }),

  // ── Product ──────────────────────────────────────────────────────────────
  getProducts: () =>
    request<ProductRecord[]>(operationTypes.product.select, {}),

  createProduct: (data: ProductRecord) =>
    request<unknown>(operationTypes.product.insert, { ...data }),

  updateProduct: (data: ProductRecord) =>
    request<unknown>(operationTypes.product.update, { ...data }),

  deleteProduct: (id: string) =>
    request<unknown>(operationTypes.product.delete, { ProductId: id }),

  // ── Dealer ───────────────────────────────────────────────────────────────
  getDealers: () =>
    request<DealerRecord[]>(operationTypes.dealer.select, {}),

  createDealer: (data: DealerRecord) =>
    request<unknown>(operationTypes.dealer.insert, { ...data }),

  updateDealer: (data: DealerRecord) =>
    request<unknown>(operationTypes.dealer.update, { ...data }),

  deleteDealer: (id: string) =>
    request<unknown>(operationTypes.dealer.delete, { DealerId: id }),

  // ── Lead Source ──────────────────────────────────────────────────────────
  getLeadSources: () =>
    request<LeadSourceRecord[]>(operationTypes.leadsource.select, {}),

  createLeadSource: (data: LeadSourceRecord) =>
    request<unknown>(operationTypes.leadsource.insert, { ...data }),

  updateLeadSource: (data: LeadSourceRecord) =>
    request<unknown>(operationTypes.leadsource.update, { ...data }),

  deleteLeadSource: (id: string) =>
    request<unknown>(operationTypes.leadsource.delete, { LeadSourceId: id }),

  // ── Industry ─────────────────────────────────────────────────────────────
  getIndustries: () =>
    request<IndustryRecord[]>(operationTypes.industry.select, {}),

  createIndustry: (data: IndustryRecord) =>
    request<unknown>(operationTypes.industry.insert, { ...data }),

  updateIndustry: (data: IndustryRecord) =>
    request<unknown>(operationTypes.industry.update, { ...data }),

  deleteIndustry: (id: string) =>
    request<unknown>(operationTypes.industry.delete, { IndustryId: id }),

  // ── Country ──────────────────────────────────────────────────────────────
  getCountries: () =>
    request<CountryRecord[]>(operationTypes.country.select, {}),

  createCountry: (data: CountryRecord) =>
    request<unknown>(operationTypes.country.insert, { ...data }),

  updateCountry: (data: CountryRecord) =>
    request<unknown>(operationTypes.country.update, { ...data }),

  deleteCountry: (id: string) =>
    request<unknown>(operationTypes.country.delete, { CountryId: id }),

  // ── State ────────────────────────────────────────────────────────────────
  getStates: (countryId?: string) =>
    request<StateRecord[]>(operationTypes.state.select, countryId ? { CountryId: countryId } : {}),

  createState: (data: StateRecord) =>
    request<unknown>(operationTypes.state.insert, { ...data }),

  updateState: (data: StateRecord) =>
    request<unknown>(operationTypes.state.update, { ...data }),

  deleteState: (id: string) =>
    request<unknown>(operationTypes.state.delete, { StateId: id }),

  // ── City ─────────────────────────────────────────────────────────────────
  getCities: (stateId?: string) =>
    request<CityRecord[]>(operationTypes.city.select, stateId ? { StateId: stateId } : {}),

  createCity: (data: CityRecord) =>
    request<unknown>(operationTypes.city.insert, { ...data }),

  updateCity: (data: CityRecord) =>
    request<unknown>(operationTypes.city.update, { ...data }),

  deleteCity: (id: string) =>
    request<unknown>(operationTypes.city.delete, { CityId: id }),

  // ── Legacy helpers (kept for backward compatibility with SimpleMasterPage) ─
  createSimple: (kind: "department" | "designation", data: SimpleMasterRecord) =>
    request<unknown>(operationTypes[kind].insert, { ...data }),

  updateSimple: (kind: "department" | "designation", data: SimpleMasterRecord) =>
    request<unknown>(operationTypes[kind].update, { ...data }),

  deleteSimple: (kind: "department" | "designation", id: string) =>
    request<unknown>(operationTypes[kind].delete, { Id: id }),

  // ── Company ─────────────────────────────────────────────────────────────
  getCompanies: () =>
    request<CompanyRecord[]>(operationTypes.company.select, {}),

  createCompany: (data: CompanyRecord) =>
    request<unknown>(operationTypes.company.insert, { ...data }),

  updateCompany: (data: CompanyRecord) =>
    request<unknown>(operationTypes.company.update, { ...data }),

  deleteCompany: (data: Partial<CompanyRecord>) =>
    request<unknown>(operationTypes.company.delete, { ...data }),
};
