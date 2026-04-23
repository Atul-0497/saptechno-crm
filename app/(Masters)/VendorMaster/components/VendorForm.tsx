"use client";

import React, { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Truck, Mail, Phone, MapPin, Hash, Search } from "lucide-react";
import { VendorSchema, type VendorFormData } from "@/app/lib/validations/masterSchemas";
import { usePincodeMaster } from "@/app/hooks/useMasters";
import type { VendorRecord, CityRecord } from "@/app/types/master";
import UniversalForm, { FormSectionConfig } from "@/app/components/forms/UniversalForm";

type VendorFormProps = {
  data: VendorRecord | null;
  cities: CityRecord[];
  onSubmit: (form: VendorFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting: boolean;
};

export default function VendorForm({
  data,
  cities,
  onSubmit,
  onCancel,
  submitting,
}: VendorFormProps) {
  const { data: allPincodes } = usePincodeMaster();

  const defaultValues = useMemo(() => {
    if (!data) return { Active: "1" };
    return {
      VendorName: data.VendorName || data.Name || "",
      Email: data.Email || "",
      Mobile: data.Mobile || "",
      Address: data.Address || "",
      Pincode: (data as any).Pincode || "",
      CityId: String(data.CityId || ""),
      Active: String(data.Active ?? "1"),
    };
  }, [data]);

  const form = useForm<VendorFormData>({
    resolver: zodResolver(VendorSchema),
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
      title: "Vendor Identity",
      subtitle: "Official business and communication details",
      fields: [
        {
          name: "VendorName",
          label: "Business Name",
          type: "text",
          icon: Truck,
          placeholder: "e.g. Acme Logistics",
          required: true,
          colSpan: 2
        },
        {
          name: "Email",
          label: "Contact Email",
          type: "email",
          icon: Mail,
          placeholder: "office@vendor.com",
          required: true
        },
        {
          name: "Mobile",
          label: "Contact Phone",
          type: "text",
          icon: Phone,
          placeholder: "+91 00000 00000",
          required: true
        }
      ]
    },
    {
      title: "Primary Address",
      subtitle: "Operational location and logistics routing",
      fields: [
        {
          name: "Pincode",
          label: "Pin Code",
          type: "text",
          icon: Hash,
          placeholder: "e.g. 110001",
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
          label: "Complete Address",
          type: "textarea",
          icon: MapPin,
          placeholder: "Street, building, area...",
          required: true,
          colSpan: 2
        }
      ]
    },
    {
      title: "System Status",
      subtitle: "Control vendor visibility in procurement",
      fields: [
        {
          name: "Active",
          label: "Operational Status",
          type: "select",
          options: [
            { label: "Active Vendor", value: "1" },
            { label: "Blacklisted / Inactive", value: "0" }
          ],
          colSpan: 2
        }
      ]
    }
  ], [cities]);

  return (
    <UniversalForm
      title={data ? "Vendor Profile" : "Onboard Vendor"}
      subtitle={data ? `Editing records for: ${data.VendorName || data.Name}` : "Add a new supply partner to the system"}
      sections={sections}
      schema={VendorSchema}
      externalForm={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting}
      submitLabel={data ? "Update Profile" : "Register Vendor"}
    />
  );
}
