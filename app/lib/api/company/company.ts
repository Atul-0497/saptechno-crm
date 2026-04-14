import axios from "axios";
import { Company } from "@/app/types/company";

const api = axios.create({
  baseURL: "/api/company", // proxy
});

const request = async (type: string, data?: any) => {
  const payload = {
    type,
    inputdata: data ? JSON.stringify(data) : "{}",

  };

  console.log("🔥 API REQUEST:", payload);

  const res = await api.post("", payload);

  console.log("🔥 API RESPONSE:", res.data);

  return res.data;
};

export const companyAPI = {
  getAll: () => request("SELECTCOMPANY"),

  create: (data: any) =>
    request("INSERTCOMPANY", {
      Name: data.Name || "",
      Address: data.Address || "",
      Email: data.Email || "",
      Mobile: data.Mobile || "",
      PlanStart: data.PlanStart || "",
      PlanEnd: data.PlanEnd || "",
      Active: data.Active || "1",
    }),

  update: (data: any) =>
    request("UPDATECOMPANY", {
      CompanyId: String(data.CompanyId),
      Name: data.Name || "",
      Address: data.Address || "",
      Email: data.Email || "",
      Mobile: data.Mobile || "",
      PlanStart: data.PlanStart || "",
      PlanEnd: data.PlanEnd || "",
      Active: data.Active || "1",
    }),

  delete: (id: string) =>
    request("DELETECOMPANY", {
      CompanyId: String(id),
    }),
};