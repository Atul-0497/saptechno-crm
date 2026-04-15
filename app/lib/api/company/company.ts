
import type { Company, CompanyPayload } from "@/app/types/company";

const baseURL = "/api/company";
const REQUEST_TIMEOUT_MS = 30000;

const toStoredProcedureInput = (data: CompanyPayload) => ({
  CompanyId: data.CompanyId,
  Name: data.Name,
  Address: data.Address,
  Email: data.Email,
  Mobile: data.Mobile,
  PlanStart: data.PlanStart,
  PlanEnd: data.PlanEnd,
  Active: data.Active,
});

const request = async <T>(type: string, data?: CompanyPayload): Promise<T> => {
  const payload = {
   type,
   inputdata: data ? JSON.stringify(toStoredProcedureInput(data)) : "{}",
 };

 let res: Response;
 const controller = new AbortController();
 const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

 try {
   res = await fetch(baseURL, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(payload),
     signal: controller.signal,
   });
 } catch (error) {
   if (error instanceof Error && error.name === "AbortError") {
     throw new Error("Company request timed out. Please try again.");
   }

   throw new Error("Unable to reach the local company API. Make sure the dev server is running.");
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
       : "Company request failed.";

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

export const companyAPI = {
 getAll: () => request<Company[]>("SELECTCOMPANY"),

 create: (data: CompanyPayload) => request<unknown>("INSERTCOMPANY", data),

 update: (data: CompanyPayload) => request<unknown>("UPDATECOMPANY", data),

 delete: (data: CompanyPayload) => request<unknown>("DELETECOMPANY", data),
};
