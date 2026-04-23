"use client";

import React, { useMemo } from "react";
import { Building2, CalendarDays, Globe, Mail, MapPin, Phone } from "lucide-react";
import { CompanySchema, type CompanyFormData } from "@/app/lib/validations/masterSchemas";
import type { CompanyRecord } from "@/app/types/master";
import UniversalForm, { FormSectionConfig } from "@/app/components/forms/UniversalForm";

type CompanyFormProps = {
  data: CompanyRecord | null;
  onSubmit: (form: CompanyFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting: boolean;
};

export default function CompanyForm({
  data,
  onSubmit,
  onCancel,
  submitting,
}: CompanyFormProps) {
  
  const sections: FormSectionConfig[] = useMemo(() => [
    {
      title: "Organization Profile",
      subtitle: "Primary identity and contact information for the tenant",
      fields: [
        {
          name: "Name",
          label: "Company Name",
          type: "text",
          icon: Building2,
          placeholder: "Saptechno CRM",
          required: true,
          colSpan: 2
        },
        {
          name: "Email",
          label: "Corporate Email",
          type: "email",
          icon: Mail,
          placeholder: "admin@company.com",
          required: true
        },
        {
          name: "Mobile",
          label: "Primary Phone",
          type: "text",
          icon: Phone,
          placeholder: "+91 98765 43210",
          required: true
        },
        {
          name: "Website",
          label: "Official Website",
          type: "text",
          icon: Globe,
          placeholder: "https://company.com",
          colSpan: 2
        }
      ]
    },
    {
      title: "Subscription & Licensing",
      subtitle: "Control valid dates and account availability",
      fields: [
        {
          name: "PlanStart",
          label: "Subscription Start",
          type: "date",
          icon: CalendarDays,
          required: true
        },
        {
          name: "PlanEnd",
          label: "Subscription Expiry",
          type: "date",
          icon: CalendarDays,
          required: true
        },
        {
          name: "Active",
          label: "Account Status",
          type: "select",
          options: [
            { label: "Active & Operational", value: "1" },
            { label: "Suspended / Inactive", value: "0" }
          ],
          colSpan: 2
        }
      ]
    },
    {
      title: "Location Details",
      subtitle: "Registered office and billing address",
      fields: [
        {
          name: "Address",
          label: "Corporate Address",
          type: "textarea",
          icon: MapPin,
          placeholder: "Billing or office address...",
          required: true,
          colSpan: 2
        }
      ]
    }
  ], []);

  const defaultValues = useMemo(() => {
    if (!data) return { Active: "1" };

    return {
      Name: data.Name || "",
      Email: data.Email || "",
      Mobile: data.Mobile || "",
      Website: data.Website || "",
      PlanStart: data.PlanStart?.split("T")[0] || "",
      PlanEnd: data.PlanEnd?.split("T")[0] || "",
      Address: data.Address || "",
      Active: String(data.Active ?? "1"),
    };
  }, [data]);

  return (
    <UniversalForm
      title={data ? "Modify Company" : "Register Company"}
      subtitle={data ? `Editing workspace: ${data.Name}` : "Setup a new tenant identity"}
      sections={sections}
      schema={CompanySchema}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting}
      submitLabel={data ? "Update Profile" : "Create Workspace"}
    />
  );
}
