import { NextResponse } from "next/server";
import { entityRegistry } from "@/app/config/entityConfig";
import { operationTypes } from "@/app/lib/api/operationTypes";
import { preparePayloadFor } from "@/app/lib/api/preparePayloadFor";

const EXTERNAL_URL = "http://saptechno-001-site17.anytempurl.com/api/CRMAPI/MagicSearch";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const { entity, action, data } = body ?? {};

  if (!entity || !action) {
    return NextResponse.json({ message: "Missing entity or action." }, { status: 400 });
  }

  // Normalize entity keys: accept client variants like "leadsourcemaster" -> "leadsource"
  const normalizedEntity = String(entity).toLowerCase().replace(/master$/, "");

  const cfg = entityRegistry[normalizedEntity];
  if (!cfg) {
    // If no registry entry exists for the normalized entity, still allow requests
    // as long as operation types are declared for it. This makes the generic
    // API tolerant to small naming variants from the client.
  }

  const ops = (operationTypes as any)[normalizedEntity];
  if (!ops || !ops[action]) {
    return NextResponse.json({ message: `Unsupported action: ${action}` }, { status: 400 });
  }

  // Prepare payload according to entity config (falls back to raw data when missing)
  const payload = preparePayloadFor((cfg ? normalizedEntity : (entity as any)), data ?? {});

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(EXTERNAL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: ops[action], inputdata: JSON.stringify(payload) }),
      signal: controller.signal,
    });

    const text = await res.text();
    let dataRes: unknown = text;

    if (text) {
      try {
        dataRes = JSON.parse(text);
      } catch {
        dataRes = text;
      }
    }

    if (!res.ok) {
      return NextResponse.json({ message: "Service rejected the request.", status: res.status, data: dataRes }, { status: 502 });
    }

    return NextResponse.json(dataRes);
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError" ? "Service timed out." : "Service unreachable.";
    return NextResponse.json({ message }, { status: 503 });
  } finally {
    clearTimeout(timeout);
  }
}
