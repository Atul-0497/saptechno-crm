"use client";

import React, { useMemo } from "react";
import { Briefcase, Layers } from "lucide-react";
import { DesignationSchema, type DesignationFormData } from "@/app/lib/validations/masterSchemas";
import type { DesignationRecord } from "@/app/types/master";
import UniversalForm, { FormSectionConfig } from "@/app/components/forms/UniversalForm";

type DesignationFormProps = {
  data: DesignationRecord | null;
  onSubmit: (form: DesignationFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting: boolean;
};

export default function DesignationForm({
  data,
  onSubmit,
  onCancel,
  submitting,
}: DesignationFormProps) {
  
  const sections: FormSectionConfig[] = useMemo(() => [
    {
      title: "Role Definition",
      subtitle: "Official job titles and hierarchical placement",
      fields: [
        {
          name: "DesignationName",
          label: "Designation Title",
          type: "text",
          icon: Briefcase,
          placeholder: "e.g. Senior Manager, Lead Engineer",
          required: true,
          colSpan: 2
        },
        {
          name: "DesignationLevel",
          label: "Grade / Level",
          type: "text",
          icon: Layers,
          placeholder: "e.g. L1, M2, Executive",
        },
        {
          name: "Active",
          label: "Role Status",
          type: "select",
          options: [
            { label: "Active Role", value: "1" },
            { label: "Deprecated", value: "0" }
          ]
        }
      ]
    }
  ], []);

  const defaultValues = useMemo(() => {
    if (!data) return { Active: "1" };
    return {
      DesignationName: data.DesignationName || data.Name || "",
      DesignationLevel: (data as any).DesignationLevel || "",
      Active: String(data.Active ?? "1"),
    };
  }, [data]);

  return (
    <UniversalForm
      title={data ? "Edit Designation" : "New Designation"}
      subtitle={data ? `Updating role profile: ${data.DesignationName || data.Name}` : "Define a new job role in the corporate hierarchy"}
      sections={sections}
      schema={DesignationSchema}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting}
      submitLabel={data ? "Update Role" : "Create Role"}
    />
  );
}
