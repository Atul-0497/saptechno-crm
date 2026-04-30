"use client";

import React, { useMemo } from "react";
import { Magnet, Hash } from "lucide-react";
import { LeadSourceSchema, type LeadSourceFormData } from "@/lib/validations/masterSchemas";
import type { LeadSourceRecord } from "@/types/master";
import UniversalForm, { FormSectionConfig } from "@/components/forms/UniversalForm";

type LeadSourceFormProps = {
  data: LeadSourceRecord | null;
  onSubmit: (form: LeadSourceFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
};

export default function LeadSourceForm({
  data,
  onSubmit,
  onCancel,
  submitting,
}: LeadSourceFormProps) {
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
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting ?? false}
      submitLabel={data ? "Update Source" : "Save Channel"}
    />
  );
}
