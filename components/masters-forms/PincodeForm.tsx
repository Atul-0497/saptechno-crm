"use client";

import React, { useMemo } from "react";
import { MapPin, Globe, Map, Landmark } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PincodeSchema, type PincodeFormData } from "@/lib/validations/masterSchemas";
import type { 
  PincodeRecord, 
  CityRecord, 
  StateRecord, 
  CountryRecord 
} from "@/types/master";
import UniversalForm, { FormSectionConfig } from "@/components/forms/UniversalForm";

type PincodeFormProps = {
  data: PincodeRecord | null;
  countries: CountryRecord[];
  states: StateRecord[];
  cities: CityRecord[];
  onSubmit: (form: PincodeFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
};

export default function PincodeForm({
  data,
  countries,
  states,
  cities,
  onSubmit,
  onCancel,
  submitting,
}: PincodeFormProps) {
const form = useForm<PincodeFormData>({
    resolver: zodResolver(PincodeSchema),
    defaultValues: {
      Pincode: data?.Pincode || "",
      CountryId: String(data?.CountryId || ""),
      StateId: String(data?.StateId || ""),
      CityId: String(data?.CityId || ""),
      Active: String(data?.Active ?? "1"),
    },
  });

  const watchCountryId = form.watch("CountryId");
  const watchStateId = form.watch("StateId");

  // Cascading filters
  const filteredStates = useMemo(() => 
    states.filter(s => String(s.CountryId) === String(watchCountryId)),
    [states, watchCountryId]
  );

  const filteredCities = useMemo(() => 
    cities.filter(c => String(c.StateId) === String(watchStateId)),
    [cities, watchStateId]
  );

  const sections: FormSectionConfig[] = useMemo(() => [
    {
      title: "Geographical Link",
      subtitle: "Associate this postal code with a hierarchy",
      fields: [
        {
          name: "CountryId",
          label: "Country",
          type: "select",
          icon: Globe,
          options: countries.map(c => ({
            label: c.CountryName || c.Name || "Unknown",
            value: String(c.CountryId ?? c.Id)
          })),
          placeholder: "Select country...",
          required: true
        },
        {
          name: "StateId",
          label: "State",
          type: "select",
          icon: Map,
          options: filteredStates.map(s => ({
            label: s.StateName || s.Name || "Unknown",
            value: String(s.StateId ?? s.Id)
          })),
          placeholder: watchCountryId ? "Select state..." : "Choose country first",
          required: true
        },
        {
          name: "CityId",
          label: "City",
          type: "select",
          icon: Landmark,
          options: filteredCities.map(c => ({
            label: c.CityName || c.Name || "Unknown",
            value: String(c.CityId ?? c.Id)
          })),
          placeholder: watchStateId ? "Select city..." : "Choose state first",
          required: true
        }
      ]
    },
    {
      title: "Postal Details",
      subtitle: "The specific delivery code and status",
      fields: [
        {
          name: "Pincode",
          label: "Pin Code / ZIP",
          type: "text",
          icon: MapPin,
          placeholder: "e.g. 110001, 90210",
          required: true,
          colSpan: 2
        },
        {
          name: "Active",
          label: "Status",
          type: "select",
          options: [
            { label: "Active Delivery", value: "1" },
            { label: "Archived / Inactive", value: "0" }
          ]
        }
      ]
    }
  ], [countries, filteredStates, filteredCities, watchCountryId, watchStateId]);

  return (
    <UniversalForm
      title={data ? "Modify Pin Code" : "New Pin Code"}
      subtitle={data ? `Editing postal zone: ${data.Pincode}` : "Register a new delivery area in the geo-database"}
      sections={sections}
      schema={PincodeSchema}
      externalForm={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting ?? false}
      submitLabel={data ? "Update Code" : "Save Pin Code"}
    />
  );
}
