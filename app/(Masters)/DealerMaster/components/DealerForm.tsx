"use client";

import React, { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, Mail, Phone, MapPin, Hash } from "lucide-react";
import { DealerSchema, type DealerFormData } from "@/app/lib/validations/masterSchemas";
import { usePincodeMaster } from "@/app/hooks/useMasters";
import type { DealerRecord, CityRecord } from "@/app/types/master";
import UniversalForm, { FormSectionConfig } from "@/app/components/forms/UniversalForm";

type DealerFormProps = {
  data: DealerRecord | null;
  cities: CityRecord[];
  onSubmit: (form: DealerFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting: boolean;
};

export default function DealerForm({
  data,
  cities,
  onSubmit,
  onCancel,
  submitting,
}: DealerFormProps) {
  const { data: allPincodes } = usePincodeMaster();

  const defaultValues = useMemo(() => {
    if (!data) return { Active: "1" };
    return {
      DealerName: data.DealerName || data.Name || "",
      Email: data.Email || "",
      Mobile: data.Mobile || "",
      Address: data.Address || "",
      Pincode: (data as any).Pincode || "",
      CityId: String(data.CityId || ""),
      Active: String(data.Active ?? "1"),
    };
  }, [data]);

  const form = useForm<DealerFormData>({
    resolver: zodResolver(DealerSchema),
    defaultValues: defaultValues as any,
  });

  const watchPincode = form.watch("Pincode");

  // Auto-fill logic
  useEffect(() => {
    if (watchPincode && watchPincode.length >= 5) {
      const match = allPincodes.find(p => p.Pincode === watchPincode);
      if (match && match.CityId) {
        form.setValue("CityId", String(match.CityId));
      }
    }
  }, [watchPincode, allPincodes, form]);

  const sections: FormSectionConfig[] = useMemo(() => [
    {
      title: "Dealer Identity",
      subtitle: "Official dealership and contact details",
      fields: [
        {
          name: "DealerName",
          label: "Dealer / Business Name",
          type: "text",
          icon: Users,
          placeholder: "e.g. Skyline Dealers",
          required: true,
          colSpan: 2
        },
        {
          name: "Email",
          label: "Corporate Email",
          type: "email",
          icon: Mail,
          placeholder: "contact@dealer.com",
          required: true
        },
        {
          name: "Mobile",
          label: "Primary Phone",
          type: "text",
          icon: Phone,
          placeholder: "+91 00000 00000",
          required: true
        }
      ]
    },
    {
      title: "Geographic Location",
      subtitle: "Regional presence and logistics routing",
      fields: [
        {
          name: "Pincode",
          label: "Pin Code",
          type: "text",
          icon: Hash,
          placeholder: "e.g. 560001",
          hint: "Autofills city"
        },
        {
          name: "CityId",
          label: "Registered City",
          type: "select",
          icon: MapPin,
          required: true,
          options: cities.map(c => ({ label: c.CityName || c.Name || "", value: String(c.CityId || c.Id || "") }))
        },
        {
          name: "Address",
          label: "Workshop / Office Address",
          type: "textarea",
          icon: MapPin,
          placeholder: "Complete physical address...",
          required: true,
          colSpan: 2
        }
      ]
    },
    {
      title: "System Control",
      subtitle: "Manage account status and accessibility",
      fields: [
        {
          name: "Active",
          label: "Operational Status",
          type: "select",
          options: [
            { label: "Active Partnership", value: "1" },
            { label: "Suspended / Inactive", value: "0" }
          ],
          colSpan: 2
        }
      ]
    }
  ], [cities]);

  return (
    <UniversalForm
      title={data ? "Dealer Partnership" : "Onboard Partner"}
      subtitle={data ? `Updating records for: ${data.DealerName || data.Name}` : "Register a new dealership in the master roster"}
      sections={sections}
      schema={DealerSchema}
      externalForm={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting}
      submitLabel={data ? "Update Partner" : "Save Partnership"}
    />
  );
}
