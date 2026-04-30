"use client";

import React, { useMemo } from "react";
import { Building, Hash } from "lucide-react";
import { DepartmentSchema, type DepartmentFormData } from "@/lib/validations/masterSchemas";
import type { DepartmentRecord } from "@/types/master";
import UniversalForm, { FormSectionConfig } from "@/components/forms/UniversalForm";

type DepartmentFormProps = {
  data: DepartmentRecord | null;
  onSubmit: (form: DepartmentFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting: boolean;
};

export default function DepartmentForm({
  data,
  onSubmit,
  onCancel,
  submitting,
}: DepartmentFormProps) {
  
  const sections: FormSectionConfig[] = useMemo(() => [
    {
      title: "Department Details",
      subtitle: "Core organizational units and identifiers",
      fields: [
        {
          name: "DepartmentName",
          label: "Department Name",
          type: "text",
          icon: Building,
          placeholder: "e.g. Sales, Marketing, HR",
          required: true,
          colSpan: 2
        },
        {
          name: "DepartmentCode",
          label: "Internal Code",
          type: "text",
          icon: Hash,
          placeholder: "e.g. SL-001",
          required: true
        },
        {
          name: "Active",
          label: "Department Status",
          type: "select",
          options: [
            { label: "Active Unit", value: "1" },
            { label: "Discontinued", value: "0" }
          ]
        }
      ]
    }
  ], []);

  const defaultValues = useMemo(() => {
    if (!data) return { Active: "1" };
    return {
      DepartmentName: data.DepartmentName || data.Name || "",
      DepartmentCode: data.DepartmentCode || "",
      Active: String(data.Active ?? "1"),
    };
  }, [data]);

  return (
    <UniversalForm
      title={data ? "Modify Department" : "New Department"}
      subtitle={data ? `Editing organizational unit: ${data.DepartmentName || data.Name}` : "Register a new business unit in the system"}
      sections={sections}
      schema={DepartmentSchema}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting ?? false}
      submitLabel={data ? "Update Unit" : "Save Department"}
    />
  );
}
