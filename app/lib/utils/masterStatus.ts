import type { ActiveValue } from "@/app/types/master";

export const isMasterInactive = (active: ActiveValue | unknown) => {
  if (active === undefined) return false;
  if (active === false || active === 0) return true;

  if (typeof active === "string") {
    const normalized = active.trim().toLowerCase();
    return normalized === "false" || normalized === "0" || normalized === "inactive";
  }

  return false;
};

export const isMasterActive = (active: ActiveValue | unknown) => !isMasterInactive(active);

export const normalizeActiveFlag = (active: ActiveValue | unknown) =>
  isMasterInactive(active) ? "0" : "1";

// Aliases for transition from companyStatus.ts
export const isCompanyInactive = isMasterInactive;
export const isCompanyActive = isMasterActive;

