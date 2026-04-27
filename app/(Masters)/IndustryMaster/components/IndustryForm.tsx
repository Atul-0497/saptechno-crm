"use client";

import React, { useMemo } from "react";
import { Factory, Hash } from "lucide-react";
import { IndustrySchema, type IndustryFormData } from "@/app/lib/validations/masterSchemas";
import { useGenericSubmit } from "@/app/hooks/useGenericSubmit";
import type { IndustryRecord } from "@/app/types/master";
import UniversalForm, { FormSectionConfig } from "@/app/components/forms/UniversalForm";

type IndustryFormProps = {
  data: IndustryRecord | null;
  onSubmit?: (form: IndustryFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
  entity?: string;
  idField?: string;
};

export default function IndustryForm({
  data,
  onSubmit,
  onCancel,
  submitting,
  entity,
  idField = "Id",
}: IndustryFormProps) {

  const generic = entity ? useGenericSubmit(entity, []) : null;
  
  const sections: FormSectionConfig[] = useMemo(() => [
    {
      title: "Vertical Details",
      subtitle: "Categorize clients and vendors by business sector",
      fields: [
        {
          name: "IndustryName",
          label: "Industry Name",
          type: "text",
          icon: Factory,
          placeholder: "e.g. Information Technology, Healthcare",
          required: true,
          colSpan: 2
        },
        {
          name: "IndustryCode",
          label: "Standard Code",
          type: "text",
          icon: Hash,
          placeholder: "e.g. IT-01",
        },
        {
          name: "Active",
          label: "Status",
          type: "select",
          options: [
            { label: "Active Sector", value: "1" },
            { label: "Inactive", value: "0" }
          ]
        }
      ]
    }
  ], []);

  const defaultValues = useMemo(() => {
    if (!data) return { Active: "1" };
    return {
      IndustryName: data.IndustryName || data.Name || "",
      IndustryCode: (data as any).IndustryCode || "",
      Active: String(data.Active ?? "1"),
    };
  }, [data]);

  return (
    <UniversalForm
      title={data ? "Edit Industry" : "New Industry"}
      subtitle={data ? `Updating sector: ${data.IndustryName || data.Name}` : "Define a new business vertical for market segmentation"}
      sections={sections}
      schema={IndustrySchema}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit ?? (async (formValues: IndustryFormData) => {
        if (!entity || !generic) throw new Error("No submit handler and no entity configured.");
        if (data) {
          const id = String((data as any)[idField] || (data as any).Id || "");
          await generic.update.mutateAsync({ id, data: formValues } as any);
        } else {
          await generic.create.mutateAsync(formValues as any);
        }
      })}
      onCancel={onCancel}
      submitting={submitting ?? (entity ? ((data ? generic?.update.isPending : generic?.create.isPending) ?? false) : false)}
      submitLabel={data ? "Update Sector" : "Save Industry"}
    />
  );
}
