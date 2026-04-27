"use client";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { entityCall } from "@/app/lib/api/genericClient";

export function useGenericSubmit(entity: string, onSuccessInvalidateKeys: QueryKey[] = []) {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: (data: Record<string, any>) => entityCall(entity, "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: onSuccessInvalidateKeys }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id?: string; data?: Record<string, any> }) =>
      entityCall(entity, "update", data ? { ...data, Id: id } : { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: onSuccessInvalidateKeys }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => entityCall(entity, "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: onSuccessInvalidateKeys }),
  });

  return { create, update, remove };
}
