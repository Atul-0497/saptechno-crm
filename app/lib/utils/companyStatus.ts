export const isCompanyInactive = (active: unknown) => {
  if (active === false || active === 0) return true;

  if (typeof active === "string") {
    const normalized = active.trim().toLowerCase();
    return normalized === "false" || normalized === "0" || normalized === "inactive";
  }

  return false;
};

export const isCompanyActive = (active: unknown) => !isCompanyInactive(active);
