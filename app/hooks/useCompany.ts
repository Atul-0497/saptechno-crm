"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyAPI } from "../lib/api/company/company";

export const useCompany = () => {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await companyAPI.getAll();
      return res || [];
    },
  });

  const create = useMutation({
    mutationFn: companyAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const update = useMutation({
    mutationFn: companyAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const remove = useMutation({
    mutationFn: companyAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return { data, isLoading, create, update, remove };
};