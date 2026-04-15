import axios from "axios";
import type { Company, CompanyPayload } from "@/app/types/company";

const api = axios.create({
  baseURL: "/api/company", // proxy
});

const request = async <T>(type: string, data?: Partial<CompanyPayload>): Promise<T> => {
  const res = await api.post("", {
    type,
    inputdata: data ? JSON.stringify(data) : "{}",
  });

  let response: unknown = res.data;

  if (typeof response === "string") {
    try {
      response = JSON.parse(response);
    } catch {
      return [] as T;
    }
  }

  return response as T;
};

export const searchAPI = {
  searchCompanies: (query: string) =>
    request<Company[]>("SELECTCOMPANY", { Name: query }),
};
