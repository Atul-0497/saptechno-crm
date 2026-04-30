"use client";

import React, { useMemo } from "react";
import { Globe, Hash } from "lucide-react";
import { CountrySchema, type CountryFormData } from "@/lib/validations/masterSchemas";
import type { CountryRecord } from "@/types/master";
import UniversalForm, { FormSectionConfig } from "@/components/forms/UniversalForm";

type CountryFormProps = {
  data: CountryRecord | null;
  onSubmit: (form: CountryFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
};

export default function CountryForm({
  data,
  onSubmit,
  onCancel,
  submitting,
}: CountryFormProps) {
const sections: FormSectionConfig[] = useMemo(() => [
    {
      title: "Country Details",
      subtitle: "International territorial markers",
      fields: [
        {
          name: "CountryName",
          label: "Country Name",
          type: "text",
          icon: Globe,
          placeholder: "e.g. India, USA, UAE",
          required: true,
          colSpan: 2
        },
        {
          name: "CountryCode",
          label: "ISO Code",
          type: "text",
          icon: Hash,
          placeholder: "e.g. IND, US, AE",
          required: true
        },
        {
          name: "Active",
          label: "Country Status",
          type: "select",
          options: [
            { label: "Active Region", value: "1" },
            { label: "Retired / Hidden", value: "0" }
          ]
        }
      ]
    }
  ], []);

  const defaultValues = useMemo(() => {
    if (!data) return { Active: "1" };
    return {
      CountryName: data.CountryName || data.Name || "",
      CountryCode: data.CountryCode || "",
      Active: String(data.Active ?? "1"),
    };
  }, [data]);

  return (
    <UniversalForm
      title={data ? "Modify Country" : "New Country"}
      subtitle={data ? `Editing territory: ${data.CountryName || data.Name}` : "Add a new country to the global registry"}
      sections={sections}
      schema={CountrySchema}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting ?? false}
      submitLabel={data ? "Update Country" : "Save Country"}
    />
  );
}
