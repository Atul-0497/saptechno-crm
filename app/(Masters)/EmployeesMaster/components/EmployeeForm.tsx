"use client";

import React, { useMemo } from "react";
import { User, Tag, Calendar, Mail, Phone, Building, Briefcase, Users, Lock } from "lucide-react";
import { EmployeeSchema, type EmployeeFormData } from "@/app/lib/validations/masterSchemas";
import type { 
  EmployeeRecord, 
  DepartmentRecord, 
  DesignationRecord 
} from "@/app/types/master";
import UniversalForm, { FormSectionConfig } from "@/app/components/forms/UniversalForm";

type EmployeeFormProps = {
  data: EmployeeRecord | null;
  departments: DepartmentRecord[];
  designations: DesignationRecord[];
  employees: EmployeeRecord[];
  onSubmit: (form: EmployeeFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting: boolean;
};

export default function EmployeeForm({
  data,
  departments,
  designations,
  employees,
  onSubmit,
  onCancel,
  submitting,
}: EmployeeFormProps) {
  
  const sections: FormSectionConfig[] = useMemo(() => [
    {
      title: "Personal Identity",
      subtitle: "Basic legal and contact information",
      fields: [
        {
          name: "FirstName",
          label: "First Name",
          type: "text",
          icon: User,
          placeholder: "e.g. John",
          required: true
        },
        {
          name: "LastName",
          label: "Last Name",
          type: "text",
          icon: User,
          placeholder: "e.g. Doe",
          required: true
        },
        {
          name: "EmailId",
          label: "Corporate Email",
          type: "email",
          icon: Mail,
          placeholder: "john@example.com",
          required: true
        },
        {
          name: "MobileNo",
          label: "Mobile Number",
          type: "text",
          icon: Phone,
          placeholder: "Contact number",
          required: true
        }
      ]
    },
    {
      title: "Employment Details",
      subtitle: "Contract and organizational placement",
      fields: [
        {
          name: "EmployeeCode",
          label: "Staff ID / Code",
          type: "text",
          icon: Tag,
          placeholder: "e.g. ST-001",
          required: true
        },
        {
          name: "JoiningDate",
          label: "Date of Joining",
          type: "date",
          icon: Calendar,
          required: true
        },
        {
          name: "DepartmentId",
          label: "Assign Department",
          type: "select",
          icon: Building,
          required: true,
          options: departments.map(d => ({ label: d.Name || "", value: String(d.Id || "") }))
        },
        {
          name: "DesignationId",
          label: "Assign Designation",
          type: "select",
          icon: Briefcase,
          required: true,
          options: designations.map(d => ({ label: d.Name || "", value: String(d.Id || "") }))
        },
        {
          name: "ReportingTo",
          label: "Reporting Manager",
          type: "select",
          icon: Users,
          options: [
            { label: "Self / None", value: "0" },
            ...employees
              .filter(e => String(e.Id || e.EmployeeId) !== String(data?.Id || data?.EmployeeId))
              .map(e => ({ 
                label: `${e.FirstName} ${e.LastName} (${e.EmployeeCode})`, 
                value: String(e.Id || e.EmployeeId) 
              }))
          ]
        },
        {
          name: "Active",
          label: "Employment Status",
          type: "select",
          options: [
            { label: "Active Staff", value: "1" },
            { label: "Resigned / Terminated", value: "0" }
          ]
        }
      ]
    },
    {
      title: "Security & Access",
      subtitle: "System credentials and login safety",
      fields: [
        {
          name: "Password",
          label: data ? "Reset Password" : "Login Password",
          type: "password",
          icon: Lock,
          placeholder: "••••••••",
          required: !data,
          hint: data ? "Leave blank to keep current password" : "Minimum 6 characters",
          colSpan: 2
        }
      ]
    }
  ], [departments, designations, employees, data]);

  const defaultValues = useMemo(() => {
    if (!data) return { 
      JoiningDate: new Date().toISOString().split("T")[0],
      Active: "1",
      ReportingTo: "0"
    };

    return {
      FirstName: data.FirstName || "",
      LastName: data.LastName || "",
      EmployeeCode: data.EmployeeCode || "",
      JoiningDate: data.JoiningDate?.split("T")[0] || "",
      EmailId: data.EmailId || "",
      MobileNo: data.MobileNo || "",
      DepartmentId: String(data.DepartmentId || ""),
      DesignationId: String(data.DesignationId || ""),
      ReportingTo: String(data.ReportingTo || "0"),
      Password: "",
      Active: String(data.Active ?? "1"),
    };
  }, [data]);

  return (
    <UniversalForm
      title={data ? "Staff Records" : "Onboard Employee"}
      subtitle={data ? `Updating profile for ${data.FirstName} ${data.LastName}` : "Add a new member to your workforce"}
      sections={sections}
      schema={EmployeeSchema}
      defaultValues={defaultValues as any}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting}
      submitLabel={data ? "Update Profile" : "Register Employee"}
    />
  );
}
