import { entityRegistry } from "@/config/entityConfig";
import { normalizeActiveFlag } from "@/lib/utils/masterStatus";

export function preparePayloadFor(kind: keyof typeof entityRegistry, data?: Record<string, any>) {
  const cfg = entityRegistry[kind];
  if (!cfg) return data ?? {};

  if (cfg.transform) return cfg.transform(data ?? {});

  const declared = cfg.sections.flatMap((s) => s.fields?.map((f) => f.name) ?? []);
  const declaredSet = new Set(declared);

  const topLevelKeep = new Set<string>();
  for (const name of declared) {
    const lower = name.toLowerCase();
    if (
      name === "Active" ||
      name === "Id" ||
      name.endsWith("Id") ||
      lower === "name" ||
      lower.endsWith("name") ||
      lower === "code" ||
      lower === "email" ||
      lower === "mobile" ||
      lower === "address" ||
      lower === "pincode" ||
      lower === "website"
    ) {
      topLevelKeep.add(name);
    }
  }

  const topLevel: Record<string, any> = {};
  const other: Record<string, any> = {};

  const src = data ?? {};
  for (const key of Object.keys(src)) {
    if (topLevelKeep.has(key) || (declaredSet.has(key) && topLevelKeep.has(key))) {
      topLevel[key] = src[key];
    } else if (key === "Id" || key.endsWith("Id")) {
      topLevel[key] = src[key];
    } else {
      other[key] = src[key];
    }
  }

  topLevel.OtherInfoJson = JSON.stringify(other);

  if (topLevel.Active !== undefined) {
    topLevel.Active = normalizeActiveFlag(topLevel.Active);
  }

  return topLevel;
}
