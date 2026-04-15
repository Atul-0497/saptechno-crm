export interface Company {
  CompanyId: string;
  Name: string;
  Address?: string;
  Email?: string;
  Mobile?: string;
  PlanStart?: string;
  PlanEnd?: string;
  Active?: string;
}

export type CompanyPayload = {
  CompanyId: string;
  Name: string;
  Address: string;
  Email: string;
  Mobile: string;
  PlanStart: string;
  PlanEnd: string;
  Active: string;
};

export type CompanyFormValues = Partial<Company> & {
  Active?: string | boolean;
};
