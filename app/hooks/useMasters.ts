"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { mastersAPI } from "@/app/lib/api/masters/masters";
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
} from "@/app/types/master";

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
    queryFn: () =>
      (kind === "department"
        ? mastersAPI.getDepartments()
        : mastersAPI.getDesignations()) as unknown as Promise<T[]>,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: (data: T) =>
      mastersAPI.createSimple(kind, data as any),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: T) =>
      mastersAPI.updateSimple(kind, data as any),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteSimple(kind, id),
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
    queryFn: mastersAPI.getEmployees,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const departments = useQuery({
    queryKey: masterKeys.departments(),
    queryFn: mastersAPI.getDepartments,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const designations = useQuery({
    queryKey: masterKeys.designations(),
    queryFn: mastersAPI.getDesignations,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: (data: EmployeeRecord) => mastersAPI.createEmployee(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: EmployeeRecord) => mastersAPI.updateEmployee(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteEmployee(id),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return {
    data,
    departments: departments.data ?? [],
    designations: designations.data ?? [],
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
    queryFn: mastersAPI.getVendors,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const cities = useQuery({
    queryKey: masterKeys.cities(),
    queryFn: () => mastersAPI.getCities(),
    enabled: mounted,
    staleTime: 1000 * 60 * 10,
  });

  const create = useMutation({
    mutationFn: (data: VendorRecord) => mastersAPI.createVendor(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: VendorRecord) => mastersAPI.updateVendor(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteVendor(id),
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
    queryFn: mastersAPI.getProducts,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: (data: ProductRecord) => mastersAPI.createProduct(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: ProductRecord) => mastersAPI.updateProduct(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteProduct(id),
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
    queryFn: mastersAPI.getDealers,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const cities = useQuery({
    queryKey: masterKeys.cities(),
    queryFn: () => mastersAPI.getCities(),
    enabled: mounted,
    staleTime: 1000 * 60 * 10,
  });

  const create = useMutation({
    mutationFn: (data: DealerRecord) => mastersAPI.createDealer(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: DealerRecord) => mastersAPI.updateDealer(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteDealer(id),
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
    queryFn: mastersAPI.getLeadSources,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: (data: LeadSourceRecord) => mastersAPI.createLeadSource(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: LeadSourceRecord) => mastersAPI.updateLeadSource(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteLeadSource(id),
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
    queryFn: mastersAPI.getIndustries,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: (data: IndustryRecord) => mastersAPI.createIndustry(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: IndustryRecord) => mastersAPI.updateIndustry(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteIndustry(id),
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
    queryFn: mastersAPI.getCountries,
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  // States (all — filtered client-side per selected country)
  const statesQuery = useQuery({
    queryKey: masterKeys.states(),
    queryFn: () => mastersAPI.getStates(),
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  // Cities (all — filtered client-side per selected state)
  const citiesQuery = useQuery({
    queryKey: masterKeys.cities(),
    queryFn: () => mastersAPI.getCities(),
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  // Country mutations
  const createCountry = useMutation({
    mutationFn: (data: CountryRecord) => mastersAPI.createCountry(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.countries() }),
  });
  const updateCountry = useMutation({
    mutationFn: (data: CountryRecord) => mastersAPI.updateCountry(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.countries() }),
  });
  const removeCountry = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteCountry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.countries() }),
  });

  // State mutations
  const createState = useMutation({
    mutationFn: (data: StateRecord) => mastersAPI.createState(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.states() }),
  });
  const updateState = useMutation({
    mutationFn: (data: StateRecord) => mastersAPI.updateState(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.states() }),
  });
  const removeState = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteState(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.states() }),
  });

  // City mutations
  const createCity = useMutation({
    mutationFn: (data: CityRecord) => mastersAPI.createCity(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.cities() }),
  });
  const updateCity = useMutation({
    mutationFn: (data: CityRecord) => mastersAPI.updateCity(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.cities() }),
  });
  const removeCity = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteCity(id),
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
    queryFn: mastersAPI.getCountries,
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  const create = useMutation({
    mutationFn: (data: CountryRecord) => mastersAPI.createCountry(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: CountryRecord) => mastersAPI.updateCountry(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteCountry(id),
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
    queryFn: () => mastersAPI.getStates(),
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  const countries = useQuery({
    queryKey: masterKeys.countries(),
    queryFn: mastersAPI.getCountries,
    enabled: mounted,
    staleTime: 1000 * 60 * 60,
  });

  const create = useMutation({
    mutationFn: (data: StateRecord) => mastersAPI.createState(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: StateRecord) => mastersAPI.updateState(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteState(id),
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
    queryFn: () => mastersAPI.getCities(),
    enabled: mounted,
    staleTime: 1000 * 60 * 30,
  });

  const states = useQuery({
    queryKey: masterKeys.states(),
    queryFn: () => mastersAPI.getStates(),
    enabled: mounted,
    staleTime: 1000 * 60 * 60,
  });

  const create = useMutation({
    mutationFn: (data: CityRecord) => mastersAPI.createCity(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: (data: CityRecord) => mastersAPI.updateCity(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => mastersAPI.deleteCity(id),
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
    queryFn: mastersAPI.getCompanies,
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: mastersAPI.createCompany,
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
    mutationFn: mastersAPI.updateCompany,
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
    mutationFn: mastersAPI.deleteCompany,
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
    queryFn: () => mastersAPI.getPincodes(cityId),
    enabled: mounted,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation({
    mutationFn: mastersAPI.createPincode,
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.pincodes() }),
  });

  const update = useMutation({
    mutationFn: mastersAPI.updatePincode,
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.pincodes() }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => mastersAPI.deletePincode(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: masterKeys.pincodes() }),
  });

  return { data, isLoading: mounted && isLoading, create, update, remove };
};

