import type { Company, CompanyFormValues, CompanyPayload } from "@/app/types/company";

export const buildCompanyPayload = (
  form: CompanyFormValues = {},
  original: CompanyFormValues = {},
  mode: "create" | "update" | "delete"
): CompanyPayload => {
  const normalizeActive = (val: string | boolean | undefined) =>
    val === "0" || val === false || val === "false" ? "false" : "true";

  const normalizeDate = (value: Company["PlanStart"]) => {
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

    PlanStart: normalizeDate(form.PlanStart ?? original.PlanStart),

    PlanEnd: normalizeDate(form.PlanEnd ?? original.PlanEnd),

    Active: normalizeActive(form.Active ?? original.Active),
  };
};
