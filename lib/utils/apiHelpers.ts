import { NextResponse } from "next/server";

export async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 20000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

export async function safeParseResponse(res: Response) {
  const text = await res.text();
  if (!text) return null;
  
  try {
    return JSON.parse(text);
  } catch {
    return text; // Fallback to raw text if not valid JSON
  }
}

export function handleApiError(error: unknown, serviceName = "Service") {
  if (error instanceof Error && error.name === "AbortError") {
    return NextResponse.json(
      { message: `${serviceName} timed out.` }, 
      { status: 504 } // Gateway Timeout
    );
  }
  
  return NextResponse.json(
    { message: `${serviceName} is not reachable.` }, 
    { status: 503 } // Service Unavailable
  );
}
