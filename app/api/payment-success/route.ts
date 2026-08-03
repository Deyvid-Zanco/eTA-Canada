import { NextRequest, NextResponse } from "next/server";
import { fulfillCheckoutSession } from "@/lib/payment-fulfillment";

export async function POST(req: NextRequest) {
  try {
    const { session_id: sessionId } = await req.json();

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
