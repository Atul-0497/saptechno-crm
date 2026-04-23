"use client";

/**
 * ENTITY API — Auto API Mapper 🔌
 *
 * Maps entity keys → mastersAPI methods automatically.
 * Pages and forms just call:
 *   await entitySave("product", formData)
 *   await entityUpdate("product", id, formData)
 *   await entityRemove("product", id)
 *
 * No manual payload construction or API name lookup needed.
 */

import { mastersAPI } from "@/app/lib/api/masters/masters";
import { entityRegistry } from "@/app/config/entityConfig";
import { normalizeActiveFlag } from "@/app/lib/utils/masterStatus";

type EntityKey = keyof typeof entityRegistry;

/**
 * Save (Insert) — transforms payload if entity has a transform fn, then calls insert
 */
export async function entitySave(entity: EntityKey, data: Record<string, any>): Promise<any> {
  const config = entityRegistry[entity];
  if (!config) throw new Error(`Unknown entity: ${entity}`);

  let payload = { ...data };

  // Normalize Active flag
  if (payload.Active !== undefined) {
    payload.Active = normalizeActiveFlag(payload.Active);
  }

  // Apply entity-level transform (e.g. Product packs OtherInfoJson)
  if (config.transform) {
    payload = config.transform(payload);
    if (data.Active !== undefined) {
      payload.Active = normalizeActiveFlag(data.Active);
    }
  }

  return (mastersAPI as any)[entity].insert(payload);
}

/**
 * Update — merges ID into payload, transforms, then calls update
 */
export async function entityUpdate(entity: EntityKey, id: string, data: Record<string, any>): Promise<any> {
  const config = entityRegistry[entity];
  if (!config) throw new Error(`Unknown entity: ${entity}`);

  let payload = { ...data };

  if (payload.Active !== undefined) {
    payload.Active = normalizeActiveFlag(payload.Active);
  }

  if (config.transform) {
    payload = config.transform(payload);
    if (data.Active !== undefined) {
      payload.Active = normalizeActiveFlag(data.Active);
    }
  }

  // Inject the ID field
  payload.Id = id;

  return (mastersAPI as any)[entity].update(payload);
}

/**
 * Remove — deletes by ID
 */
export async function entityRemove(entity: EntityKey, id: string): Promise<any> {
  return (mastersAPI as any)[entity].remove(id);
}

/**
 * Fetch list of records for an entity
 */
export async function entityFetch(entity: EntityKey): Promise<any[]> {
  return (mastersAPI as any)[entity].getAll();
}
