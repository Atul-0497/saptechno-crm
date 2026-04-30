"use client";

import React, { useMemo } from "react";
import { Landmark, Map } from "lucide-react";
import { CitySchema, type CityFormData } from "@/lib/validations/masterSchemas";
import type { CityRecord, StateRecord } from "@/types/master";
import UniversalForm, { FormSectionConfig } from "@/components/forms/UniversalForm";

type CityFormProps = {
  data: CityRecord | null;
  states: StateRecord[];
  onSubmit: (form: CityFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
};

export default function CityForm({
  data,
  states,
  onSubmit,
  onCancel,
  submitting,
}: CityFormProps) {
const sections: FormSectionConfig[] = useMemo(() => [
    {
      title: "City Details",
      subtitle: "Map urban areas to their respective states",
      fields: [
        {
          name: "CityName",
          label: "City Name",
          type: "text",
          icon: Landmark,
          placeholder: "e.g. Pune, Los Angeles, Dubai Sports City",
          required: true,
          colSpan: 2
        },
        {
          name: "StateId",
          label: "Parent State / Province",
          type: "select",
          options: states.map(s => ({
            label: s.StateName || s.Name || "Unknown State",
            value: String(s.StateId ?? s.Id)
          })),
          required: true
        },
        {
          name: "Active",
          label: "Status",
          type: "select",
          options: [
            { label: "Active City", value: "1" },
            { label: "Inactive", value: "0" }
          ]
        }
      ]
    }
  ], [states]);

  const defaultValues = useMemo(() => {
    if (!data) return { Active: "1" };
    return {
      CityName: data.CityName || data.Name || "",
      StateId: String(data.StateId || ""),
      Active: String(data.Active ?? "1"),
    };
  }, [data]);

  return (
    <UniversalForm
      title={data ? "Edit City" : "New City"}
      subtitle={data ? `Updating city: ${data.CityName || data.Name}` : "Add a new urban location to the regional database"}
      sections={sections}
      schema={CitySchema}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting ?? false}
      submitLabel={data ? "Update City" : "Save City"}
    />
  );
}
