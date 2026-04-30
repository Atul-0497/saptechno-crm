"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { entityCall } from "@/lib/api/genericClient";
import type {
  CityRecord,
  CompanyRecord,
  CountryRecord,
  DealerRecord,
  DepartmentRecord,
  DesignationRecord,
  EmployeeRecord,
  IndustryRecord,
  LeadSourceRecord,
  ProductRecord,
  SimpleMasterRecord,
  StateRecord,
  VendorRecord,
} from "@/types/master";

// ─── Hydration guard ──────────────────────────────────────────────────────

const emptySubscribe = () => () => { };
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

// ─── Query keys ───────────────────────────────────────────────────────────

export const masterKeys = {
  departments: () => ["departments"] as const,
  designations: () => ["designations"] as const,
  employees: () => ["employees"] as const,
  vendors: () => ["vendors"] as const,
  products: () => ["products"] as const,
  dealers: () => ["dealers"] as const,
  leadSources: () => ["leadSources"] as const,
  industries: () => ["industries"] as const,
  countries: () => ["countries"] as const,
  states: (countryId?: string) => ["states", countryId ?? "all"] as const,
  cities: (stateId?: string) => ["cities", stateId ?? "all"] as const,
  companies: () => ["companies"] as const,
  pincodes: (cityId?: string) => ["pincodes", cityId ?? "all"] as const,
};


// ─── Department / Designation (Generic Simple Master) ───────────────────────

export const useDepartmentMaster = () => useSimpleMaster<DepartmentRecord>("department");
export const useDesignationMaster = () => useSimpleMaster<DesignationRecord>("designation");

export const useSimpleMaster = <T extends { Id?: string; Active?: any }>(
  kind: "department" | "designation"
) => {
  const qc = useQueryClient();
  const mounted = useIsMounted();
  const queryKey =
    kind === "department" ? masterKeys.departments() : masterKeys.designations();

  const { data = [], isLoading } = useQuery<T[]>({
    queryKey,
    queryFn: () => (kind === "department"
      ? entityCall("department", "select") as unknown as Promise<T[]>
      : entityCall("designation", "select") as unknown as Promise<T[]>),
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: (data: T) => entityCall(kind, "insert", data as any),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: T) => entityCall(kind, "update", data as any),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => entityCall(kind, "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return { data, isLoading: mounted && isLoading, create, update, remove };
};

// ─── Employee ─────────────────────────────────────────────────────────────

export const useEmployeeMaster = () => {
  const qc = useQueryClient();
  const mounted = useIsMounted();
  const queryKey = masterKeys.employees();

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => entityCall("employee", "select") as unknown as Promise<EmployeeRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const departments = useQuery({
    queryKey: masterKeys.departments(),
    queryFn: () => entityCall("department", "select") as unknown as Promise<DepartmentRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const designations = useQuery({
    queryKey: masterKeys.designations(),
    queryFn: () => entityCall("designation", "select") as unknown as Promise<DesignationRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: (data: EmployeeRecord) => entityCall("employee", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: EmployeeRecord) => entityCall("employee", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => entityCall("employee", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return {
    data,
    departments: (departments.data ?? []) as unknown as SimpleMasterRecord[],
    designations: (designations.data ?? []) as unknown as SimpleMasterRecord[],
    isLoading: mounted && isLoading,
    isLookupLoading: departments.isLoading || designations.isLoading,
    create,
    update,
    remove,
  };
};

// ─── Vendor ───────────────────────────────────────────────────────────────

export const useVendorMaster = () => {
  const qc = useQueryClient();
  const mounted = useIsMounted();
  const queryKey = masterKeys.vendors();

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => entityCall("vendor", "select") as unknown as Promise<VendorRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const cities = useQuery({
    queryKey: masterKeys.cities(),
    queryFn: () => entityCall("city", "select") as unknown as Promise<CityRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 10,
  });

  const create = useMutation({
    mutationFn: (data: VendorRecord) => entityCall("vendor", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: VendorRecord) => entityCall("vendor", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => entityCall("vendor", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return {
    data,
    cities: cities.data ?? [],
    isLoading: mounted && isLoading,
    isLookupLoading: cities.isLoading,
    create,
    update,
    remove,
  };
};

// ─── Product ──────────────────────────────────────────────────────────────

export const useProductMaster = () => {
  const qc = useQueryClient();
  const mounted = useIsMounted();
  const queryKey = masterKeys.products();

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => entityCall("product", "select") as unknown as Promise<ProductRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: (data: ProductRecord) => entityCall("product", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: ProductRecord) => entityCall("product", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => entityCall("product", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return { data, isLoading: mounted && isLoading, create, update, remove };
};

// ─── Dealer ───────────────────────────────────────────────────────────────

export const useDealerMaster = () => {
  const qc = useQueryClient();
  const mounted = useIsMounted();
  const queryKey = masterKeys.dealers();

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => entityCall("dealer", "select") as unknown as Promise<DealerRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const cities = useQuery({
    queryKey: masterKeys.cities(),
    queryFn: () => entityCall("city", "select") as unknown as Promise<CityRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 10,
  });

  const create = useMutation({
    mutationFn: (data: DealerRecord) => entityCall("dealer", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: DealerRecord) => entityCall("dealer", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => entityCall("dealer", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return {
    data,
    cities: cities.data ?? [],
    isLoading: mounted && isLoading,
    isLookupLoading: cities.isLoading,
    create,
    update,
    remove,
  };
};

// ─── Lead Source ──────────────────────────────────────────────────────────

export const useLeadSourceMaster = () => {
  const qc = useQueryClient();
  const mounted = useIsMounted();
  const queryKey = masterKeys.leadSources();

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => entityCall("leadsourcemaster", "select") as unknown as Promise<LeadSourceRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: (data: LeadSourceRecord) => entityCall("leadsourcemaster", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: LeadSourceRecord) => entityCall("leadsourcemaster", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => entityCall("leadsourcemaster", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return { data, isLoading: mounted && isLoading, create, update, remove };
};

// ─── Industry ─────────────────────────────────────────────────────────────

export const useIndustryMaster = () => {
  const qc = useQueryClient();
  const mounted = useIsMounted();
  const queryKey = masterKeys.industries();

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => entityCall("industry", "select") as unknown as Promise<IndustryRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: (data: IndustryRecord) => entityCall("industry", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: IndustryRecord) => entityCall("industry", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => entityCall("industry", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return { data, isLoading: mounted && isLoading, create, update, remove };
};

// ─── Location (Country / State / City) ────────────────────────────────────

export const useLocationMaster = () => {
  const qc = useQueryClient();
  const mounted = useIsMounted();

  // Countries
  const countriesQuery = useQuery({
    queryKey: masterKeys.countries(),
    queryFn: () => entityCall("country", "select") as unknown as Promise<CountryRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  // States (all — filtered client-side per selected country)
  const statesQuery = useQuery({
    queryKey: masterKeys.states(),
    queryFn: () => entityCall("state", "select") as unknown as Promise<StateRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  // Cities (all — filtered client-side per selected state)
  const citiesQuery = useQuery({
    queryKey: masterKeys.cities(),
    queryFn: () => entityCall("city", "select") as unknown as Promise<CityRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  // Country mutations
  const createCountry = useMutation({
    mutationFn: (data: CountryRecord) => entityCall("country", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.countries() }),
  });
  const updateCountry = useMutation({
    mutationFn: (data: CountryRecord) => entityCall("country", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.countries() }),
  });
  const removeCountry = useMutation({
    mutationFn: (id: string) => entityCall("country", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.countries() }),
  });

  // State mutations
  const createState = useMutation({
    mutationFn: (data: StateRecord) => entityCall("state", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.states() }),
  });
  const updateState = useMutation({
    mutationFn: (data: StateRecord) => entityCall("state", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.states() }),
  });
  const removeState = useMutation({
    mutationFn: (id: string) => entityCall("state", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.states() }),
  });

  // City mutations
  const createCity = useMutation({
    mutationFn: (data: CityRecord) => entityCall("city", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.cities() }),
  });
  const updateCity = useMutation({
    mutationFn: (data: CityRecord) => entityCall("city", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.cities() }),
  });
  const removeCity = useMutation({
    mutationFn: (id: string) => entityCall("city", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.cities() }),
  });

  return {
    countries: countriesQuery.data ?? [],
    states: statesQuery.data ?? [],
    cities: citiesQuery.data ?? [],
    isLoading: mounted && (
      countriesQuery.isLoading ||
      statesQuery.isLoading ||
      citiesQuery.isLoading
    ),
    country: { create: createCountry, update: updateCountry, remove: removeCountry },
    state: { create: createState, update: updateState, remove: removeState },
    city: { create: createCity, update: updateCity, remove: removeCity },
  };
};

export const useCountryMaster = () => {
  const qc = useQueryClient();
  const mounted = useIsMounted();
  const queryKey = masterKeys.countries();

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => entityCall("country", "select") as unknown as Promise<CountryRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  const create = useMutation({
    mutationFn: (data: CountryRecord) => entityCall("country", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: CountryRecord) => entityCall("country", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => entityCall("country", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return { data, isLoading: mounted && isLoading, create, update, remove };
};

export const useStateMaster = () => {
  const qc = useQueryClient();
  const mounted = useIsMounted();
  const queryKey = masterKeys.states();

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => entityCall("state", "select") as unknown as Promise<StateRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  const countries = useQuery({
    queryKey: masterKeys.countries(),
    queryFn: () => entityCall("country", "select") as unknown as Promise<CountryRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 60,
  });

  const create = useMutation({
    mutationFn: (data: StateRecord) => entityCall("state", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: StateRecord) => entityCall("state", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => entityCall("state", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return {
    data,
    countries: countries.data ?? [],
    isLoading: mounted && (isLoading || countries.isLoading),
    create,
    update,
    remove,
  };
};

export const useCityMaster = () => {
  const qc = useQueryClient();
  const mounted = useIsMounted();
  const queryKey = masterKeys.cities();

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => entityCall("city", "select") as unknown as Promise<CityRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  const states = useQuery({
    queryKey: masterKeys.states(),
    queryFn: () => entityCall("state", "select") as unknown as Promise<StateRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 60,
  });

  const create = useMutation({
    mutationFn: (data: CityRecord) => entityCall("city", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: CityRecord) => entityCall("city", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => entityCall("city", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return {
    data,
    states: states.data ?? [],
    isLoading: mounted && (isLoading || states.isLoading),
    create,
    update,
    remove,
  };
};

// ─── Company ──────────────────────────────────────────────────────────────

export const useCompanyMaster = () => {
  const qc = useQueryClient();
  const mounted = useIsMounted();
  const queryKey = masterKeys.companies();

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => entityCall("company", "select") as unknown as Promise<CompanyRecord[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: (data: CompanyRecord) => entityCall("company", "insert", data),
    onMutate: async (newData) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<CompanyRecord[]>(queryKey);

      qc.setQueryData<CompanyRecord[]>(queryKey, (old = []) => [
        ...old,
        {
          ...newData,
          CompanyId: "temp-" + Date.now(),
          Name: newData.Name ?? "",
        },
      ]);

      return { prev };
    },
    onError: (_err, _data, ctx) => {
      qc.setQueryData(queryKey, ctx?.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    },
  });

  const update = useMutation({
    mutationFn: (data: CompanyRecord) => entityCall("company", "update", data),
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<CompanyRecord[]>(queryKey);

      qc.setQueryData<CompanyRecord[]>(queryKey, (old = []) =>
        old.map((c) =>
          c.CompanyId === data.CompanyId ? { ...c, ...data } : c
        )
      );

      return { prev };
    },
    onError: (_err, _data, ctx) => {
      qc.setQueryData(queryKey, ctx?.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    },
  });

  const remove = useMutation({
    mutationFn: (data: CompanyRecord) => entityCall("company", "delete", data),
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<CompanyRecord[]>(queryKey);

      qc.setQueryData<CompanyRecord[]>(queryKey, (old = []) =>
        old.filter((c) => c.CompanyId !== data.CompanyId)
      );

      return { prev };
    },
    onError: (_err, _data, ctx) => {
      qc.setQueryData(queryKey, ctx?.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    },
  });

  return { data, isLoading: mounted && isLoading, create, update, remove };
};

// ─── Pincode ─────────────────────────────────────────────────────────────

export const usePincodeMaster = (cityId?: string) => {
  const qc = useQueryClient();
  const mounted = useIsMounted();
  const queryKey = masterKeys.pincodes(cityId);

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => entityCall("pincode", "select", { CityId: cityId }) as unknown as Promise<any[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: (data: any) => entityCall("pincode", "insert", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.pincodes() }),
  });

  const update = useMutation({
    mutationFn: (data: any) => entityCall("pincode", "update", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.pincodes() }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => entityCall("pincode", "delete", { Id: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.pincodes() }),
  });

  return { data, isLoading: mounted && isLoading, create, update, remove };
};

