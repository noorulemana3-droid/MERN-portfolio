import { NextResponse } from "next/server";
import { submitContact } from "@/actions/contact";
import type { ContactInput } from "@/lib/validations";

const STATUS_BY_CODE = {
  VALIDATION: 400,
  NOT_CONFIGURED: 503,
  INSERT_FAILED: 500,
} as const;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactInput;
    const result = await submitContact(body);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: STATUS_BY_CODE[result.code] },
      );
    }

    return NextResponse.json({
      message: result.message,
      stored: result.stored,
      id: result.id,
      emails: result.emails,
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
