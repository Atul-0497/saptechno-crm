import { NextResponse } from "next/server";
import { fetchWithTimeout, safeParseResponse, handleApiError } from "@/lib/utils/apiHelpers";

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

  try {
    const res = await fetchWithTimeout(
      "http://saptechno-001-site17.anytempurl.com/api/CRMAPI/MagicSearch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const data = await safeParseResponse(res);

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
    return handleApiError(error, "Company service");
  }
}
