import { normalizeActiveFlag } from "./masterStatus";
import type { CompanyRecord, CompanyFormValues, CompanyPayload } from "@/app/types/master";

export const buildCompanyPayload = (
  form: CompanyFormValues = {},
  original: CompanyFormValues = {},
  mode: "create" | "update" | "delete"
): CompanyPayload => {
  const normalizeDate = (value: CompanyRecord["PlanStart"]) => {
    const date = value?.split("T")[0];
    return date ? `${date}T00:00:00` : "";
  };

  const companyId = String(form.CompanyId || original.CompanyId || "");

  return {
    CompanyId: mode === "create" && !companyId ? "0" : companyId,

    Name: form.Name ?? original.Name ?? "",
    Address: form.Address ?? original.Address ?? "",
    Email: form.Email ?? original.Email ?? "",
    Mobile: form.Mobile ?? original.Mobile ?? "",
    Website: form.Website ?? original.Website ?? "",

    PlanStart: normalizeDate(form.PlanStart ?? original.PlanStart),

    PlanEnd: normalizeDate(form.PlanEnd ?? original.PlanEnd),

    Active: normalizeActiveFlag(form.Active ?? original.Active),
  };
};
