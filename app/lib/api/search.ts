import axios from "axios";

const api = axios.create({
  baseURL: "/api/company", // proxy
});

const request = async (type: string, data?: any) => {
  const res = await api.post("", {
    type,
    inputdata: data ? JSON.stringify(data) : "{}",
  });

  let response = res.data;

  if (typeof response === "string") {
    try {
      response = JSON.parse(response);
    } catch {
      return [];
    }
  }

  return response;
};

export const searchAPI = {
  searchCompanies: (query: string) =>
    request("SELECTCOMPANY", { Name: query }),
};