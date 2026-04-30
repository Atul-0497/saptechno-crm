"use client";

import React, { useMemo } from "react";
import { MapPin, Globe } from "lucide-react";
import { LocationSchema, type LocationFormData } from "@/lib/validations/masterSchemas";

import UniversalForm, { FormSectionConfig } from "@/components/forms/UniversalForm";

type LocationFormProps = {
  data: any | null;
  onSubmit: (form: LocationFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting: boolean;
};

export default function LocationForm({
  data,
  onSubmit,
  onCancel,
  submitting,
}: LocationFormProps) {
  
  const sections: FormSectionConfig[] = useMemo(() => [
    {
      title: "Geographical Details",
      subtitle: "Define service areas or office locations",
      fields: [
        {
          name: "LocationName",
          label: "Location Name",
          type: "text",
          icon: MapPin,
          placeholder: "e.g. Mumbai, New York, Regional Office North",
          required: true,
          colSpan: 2
        },
        {
          name: "LocationCode",
          label: "Region Code",
          type: "text",
          icon: Globe,
          placeholder: "e.g. MUM-01",
        },
        {
          name: "Active",
          label: "Status",
          type: "select",
          options: [
            { label: "Active Region", value: "1" },
            { label: "Closed / Inactive", value: "0" }
          ]
        }
      ]
    }
  ], []);

  const defaultValues = useMemo(() => {
    if (!data) return { Active: "1" };
    return {
      LocationName: data.LocationName || data.Name || "",
      LocationCode: (data as any).LocationCode || "",
      Active: String(data.Active ?? "1"),
    };
  }, [data]);

  return (
    <UniversalForm
      title={data ? "Edit Location" : "New Location"}
      subtitle={data ? `Updating area: ${data.LocationName || data.Name}` : "Register a new operative region or office site"}
      sections={sections}
      schema={LocationSchema}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting ?? false}
      submitLabel={data ? "Update Region" : "Save Location"}
    />
  );
}
