import axios from "axios";
import type { CompanyRecord, CompanyPayload } from "@/app/types/master";

const api = axios.create({
  baseURL: "/api", // Unified API route
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
    request<CompanyRecord[]>("SELECTCOMPANY", { Name: query }),
};
