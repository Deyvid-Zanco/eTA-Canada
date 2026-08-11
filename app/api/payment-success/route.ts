import { NextRequest, NextResponse } from "next/server";
import { fulfillCheckoutSession } from "@/lib/payment-fulfillment";
import { rejectCrossSiteRequest } from "@/lib/security/requestGuards";

export async function POST(req: NextRequest) {
  const rejected = rejectCrossSiteRequest(req);
  if (rejected) return rejected;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const sessionId = body.session_id;

    if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
      return NextResponse.json({ error: "Invalid session_id" }, { status: 400 });
    }

    const result = await fulfillCheckoutSession(sessionId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment fulfillment failed", error);
    return NextResponse.json(
      { error: "Unable to confirm payment fulfillment" },
      { status: 500 },
    );
  }
}
