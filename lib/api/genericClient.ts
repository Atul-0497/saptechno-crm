export async function entityCall(entity: string, action: "select" | "insert" | "update" | "delete", data?: Record<string, any>) {
  const res = await fetch(`/api/generic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity, action, data }),
    cache: "no-store",
  });

  const text = await res.text();
  let parsed: unknown = text;
  if (text) {
    try { parsed = JSON.parse(text); } catch { parsed = text; }
  }

  if (!res.ok) {
    throw new Error((parsed && typeof parsed === "object" && (parsed as any).message) || "Generic entity call failed.");
  }

  return parsed;
}
