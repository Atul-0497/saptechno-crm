export const operationTypes = {
  department: {
    select: "SELECTDEPARTMENT",
    insert: "INSERTDEPARTMENT",
    update: "UPDATEDEPARTMENT",
    delete: "DELETEDEPARTMENT",
  },
  designation: {
    select: "SELECTDESIGNATION",
    insert: "INSERTDESIGNATION",
    update: "UPDATEDESIGNATION",
    delete: "DELETEDESIGNATION",
  },
  employee: {
    select: "SELECTEMPLOYEE",
    insert: "INSERTEMPLOYEE",
    update: "UPDATEEMPLOYEE",
    delete: "DELETEEMPLOYEE",
  },
  vendor: {
    select: "SELECTVENDOR",
    insert: "INSERTVENDOR",
    update: "UPDATEVENDOR",
    delete: "DELETEVENDOR",
  },
  product: {
    select: "SELECTPRODUCTMASTER",
    insert: "INSERTPRODUCTMASTER",
    update: "UPDATEPRODUCTMASTER",
    delete: "DELETEPRODUCTMASTER",
  },
  dealer: {
    select: "SELECTDEALER",
    insert: "INSERTDEALER",
    update: "UPDATEDEALER",
    delete: "DELETEDEALER",
  },
  leadsource: {
    select: "SELECTLEADSOURCE",
    insert: "INSERTLEADSOURCE",
    update: "UPDATELEADSOURCE",
    delete: "DELETELEADSOURCE",
  },
  industry: {
    select: "SELECTINDUSTRY",
    insert: "INSERTINDUSTRY",
    update: "UPDATEINDUSTRY",
    delete: "DELETEINDUSTRY",
  },
  country: {
    select: "SELECTCOUNTRY",
    insert: "INSERTCOUNTRY",
    update: "UPDATECOUNTRY",
    delete: "DELETECOUNTRY",
  },
  state: {
    select: "SELECTSTATE",
    insert: "INSERTSTATE",
    update: "UPDATESTATE",
    delete: "DELETESTATE",
  },
  city: {
    select: "SELECTCITY",
    insert: "INSERTCITY",
    update: "UPDATECITY",
    delete: "DELETECITY",
  },
  company: {
    select: "SELECTCOMPANY",
    insert: "INSERTCOMPANY",
    update: "UPDATECOMPANY",
    delete: "DELETECOMPANY",
  },
  pincode: {
    select: "SELECTPINCODE",
    insert: "INSERTPINCODE",
    update: "UPDATEPINCODE",
    delete: "DELETEPINCODE",
  },
} as const;

export type OperationKind = keyof typeof operationTypes;
