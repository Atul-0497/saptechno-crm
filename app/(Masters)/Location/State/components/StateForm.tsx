"use client";

import React, { useMemo } from "react";
import { Map, Globe } from "lucide-react";
import { StateSchema, type StateFormData } from "@/app/lib/validations/masterSchemas";
import type { StateRecord, CountryRecord } from "@/app/types/master";
import UniversalForm, { FormSectionConfig } from "@/app/components/forms/UniversalForm";

type StateFormProps = {
  data: StateRecord | null;
  countries: CountryRecord[];
  onSubmit: (form: StateFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting: boolean;
};

export default function StateForm({
  data,
  countries,
  onSubmit,
  onCancel,
  submitting,
}: StateFormProps) {
  
  const sections: FormSectionConfig[] = useMemo(() => [
    {
      title: "State / Province Details",
      subtitle: "Define regional territories within countries",
      fields: [
        {
          name: "StateName",
          label: "State Name",
          type: "text",
          icon: Map,
          placeholder: "e.g. Maharashtra, California, Dubai",
          required: true,
          colSpan: 2
        },
        {
          name: "CountryId",
          label: "Parent Country",
          type: "select",
          options: countries.map(c => ({
            label: c.CountryName || c.Name || "Unknown Country",
            value: String(c.CountryId ?? c.Id)
          })),
          required: true
        },
        {
          name: "Active",
          label: "Status",
          type: "select",
          options: [
            { label: "Active Region", value: "1" },
            { label: "Inactive", value: "0" }
          ]
        }
      ]
    }
  ], [countries]);

  const defaultValues = useMemo(() => {
    if (!data) return { Active: "1" };
    return {
      StateName: data.StateName || data.Name || "",
      CountryId: String(data.CountryId || ""),
      Active: String(data.Active ?? "1"),
    };
  }, [data]);

  return (
    <UniversalForm
      title={data ? "Modify State" : "New State"}
      subtitle={data ? `Editing region: ${data.StateName || data.Name}` : "Create a new state or province in the system"}
      sections={sections}
      schema={StateSchema}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting}
      submitLabel={data ? "Update State" : "Save State"}
    />
  );
}
