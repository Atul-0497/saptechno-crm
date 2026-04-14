"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyAPI } from "../lib/api/company/company";

export const useCompany = () => {
  const qc = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: companyAPI.getAll,
  });

  const create = useMutation({
    mutationFn: companyAPI.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });

  const update = useMutation({
    mutationFn: companyAPI.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });

  const remove = useMutation({
    mutationFn: companyAPI.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });

  return { data, isLoading, create, update, remove };
};