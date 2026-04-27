"use client";

import React, { useMemo } from "react";
import { Magnet, Hash } from "lucide-react";
import { LeadSourceSchema, type LeadSourceFormData } from "@/app/lib/validations/masterSchemas";
import { useGenericSubmit } from "@/app/hooks/useGenericSubmit";
import type { LeadSourceRecord } from "@/app/types/master";
import UniversalForm, { FormSectionConfig } from "@/app/components/forms/UniversalForm";

type LeadSourceFormProps = {
  data: LeadSourceRecord | null;
  onSubmit?: (form: LeadSourceFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
  entity?: string;
  idField?: string;
};

export default function LeadSourceForm({
  data,
  onSubmit,
  onCancel,
  submitting,
  entity,
  idField = "Id",
}: LeadSourceFormProps) {

  const generic = entity ? useGenericSubmit(entity, []) : null;
  
  const sections: FormSectionConfig[] = useMemo(() => [
    {
      title: "Channel Details",
      subtitle: "Identify where your business opportunities originate",
      fields: [
        {
          name: "SourceName",
          label: "Source Name",
          type: "text",
          icon: Magnet,
          placeholder: "e.g. Google Ads, Referral, Exhibition",
          required: true,
          colSpan: 2
        },
        {
          name: "LeadSourceCode",
          label: "Internal Code",
          type: "text",
          icon: Hash,
          placeholder: "e.g. WEB-01",
        },
        {
          name: "Active",
          label: "Source Status",
          type: "select",
          options: [
            { label: "Active Revenue Stream", value: "1" },
            { label: "Deprecated Stream", value: "0" }
          ]
        }
      ]
    }
  ], []);

  const defaultValues = useMemo(() => {
    if (!data) return { Active: "1" };
    return {
      SourceName: data.SourceName || data.Name || "",
      Active: String(data.Active ?? "1"),
    };
  }, [data]);

  return (
    <UniversalForm
      title={data ? "Edit Lead Source" : "New Lead Source"}
      subtitle={data ? `Updating channel: ${data.SourceName || data.Name}` : "Define a new marketing or referral channel"}
      sections={sections}
      schema={LeadSourceSchema}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit ?? (async (formValues: LeadSourceFormData) => {
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
      submitLabel={data ? "Update Source" : "Save Channel"}
    />
  );
}
