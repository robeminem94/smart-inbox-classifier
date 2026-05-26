import { NextResponse } from "next/server";
import { classifyMessage } from "@/lib/aiClassifier";
import { validateMessageInput } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const validation = validateMessageInput(payload);
  if (!validation.success) {
    return NextResponse.json({ error: "Validation failed.", details: validation.errors }, { status: 400 });
  }

  try {
    const result = await classifyMessage(validation.data);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to classify inbound message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
