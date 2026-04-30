"use server";

import { z } from "zod";
import { entityCall } from "@/lib/api/genericClient";
import {
  CompanySchema,
  DepartmentSchema,
  DesignationSchema,
  ProductSchema,
  LeadSourceSchema,
  IndustrySchema,
  VendorSchema,
  DealerSchema,
  CountrySchema,
  EmployeeSchema,
  StateSchema,
  CitySchema,
  PincodeSchema,
  LocationSchema,
} from "@/lib/validations/masterSchemas";

const schemaMap: Record<string, z.ZodTypeAny | undefined> = {
  company: CompanySchema,
  department: DepartmentSchema,
  designation: DesignationSchema,
  product: ProductSchema,
  leadsource: LeadSourceSchema,
  industry: IndustrySchema,
  vendor: VendorSchema,
  dealer: DealerSchema,
  country: CountrySchema,
  employee: EmployeeSchema,
  state: StateSchema,
  city: CitySchema,
  pincode: PincodeSchema,
  location: LocationSchema,
};

export async function createMaster(entity: string, data: Record<string, any>) {
  const schema = schemaMap[entity];
  if (schema) schema.parse(data);
  return await entityCall(entity, "insert", data);
}

export async function updateMaster(entity: string, id: string, data: Record<string, any>) {
  const schema = schemaMap[entity];
  if (schema) schema.parse(data);
  return await entityCall(entity, "update", { ...data, Id: id });
}

export async function deleteMaster(entity: string, id: string) {
  return await entityCall(entity, "delete", { Id: id });
}
