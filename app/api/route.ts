import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid company request payload." },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(
      "http://saptechno-001-site17.anytempurl.com/api/CRMAPI/MagicSearch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: controller.signal,
      }
    );

    const text = await res.text();
    let data: unknown = text;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          message: "Company service rejected the request.",
          status: res.status,
          data,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Company service timed out."
        : "Company service is not reachable.";

    return NextResponse.json({ message }, { status: 503 });
  } finally {
    clearTimeout(timeout);
  }
}
