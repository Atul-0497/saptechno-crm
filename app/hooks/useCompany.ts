"use client";

import { useSyncExternalStore } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyAPI } from "../lib/api/company.api";
import type { Company } from "../types/company";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const useCompany = () => {
  const qc = useQueryClient();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const { data = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: companyAPI.getAll,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: companyAPI.create,
    onMutate: async (newData) => {
      await qc.cancelQueries({ queryKey: ["companies"] });
      const prev = qc.getQueryData<Company[]>(["companies"]);

      qc.setQueryData<Company[]>(["companies"], (old = []) => [
        ...old,
        {
          ...newData,
          CompanyId: "temp-" + Date.now(),
          Name: newData.Name ?? "",
        },
      ]);

      return { prev };
    },
    onError: (_err, _data, ctx) => {
      qc.setQueryData(["companies"], ctx?.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const update = useMutation({
    mutationFn: companyAPI.update,
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: ["companies"] });
      const prev = qc.getQueryData<Company[]>(["companies"]);

      qc.setQueryData<Company[]>(["companies"], (old = []) =>
        old.map((c) =>
          c.CompanyId === data.CompanyId ? { ...c, ...data } : c
        )
      );

      return { prev };
    },
    onError: (_err, _data, ctx) => {
      qc.setQueryData(["companies"], ctx?.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const remove = useMutation({
    mutationFn: companyAPI.delete,
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: ["companies"] });
      const prev = qc.getQueryData<Company[]>(["companies"]);

      qc.setQueryData<Company[]>(["companies"], (old = []) =>
        old.filter((c) => c.CompanyId !== data.CompanyId)
      );

      return { prev };
    },
    onError: (_err, _data, ctx) => {
      qc.setQueryData(["companies"], ctx?.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return { data, isLoading: mounted && isLoading, create, update, remove };
};
