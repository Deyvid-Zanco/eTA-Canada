import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { rejectCrossSiteRequest } from "@/lib/security/requestGuards";

function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) throw new Error("Stripe is not configured");

  return new Stripe(apiKey, {
    apiVersion: "2025-06-30.basil",
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export async function POST(req: NextRequest) {
  const rejected = rejectCrossSiteRequest(req);
  if (rejected) return rejected;

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > 4096) {
    return NextResponse.json({ error: "Request is too large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!/^\S+@\S+\.\S+$/.test(email) || !name || name.length > 160) {
      return NextResponse.json({ error: "Valid applicant details are required" }, { status: 400 });
    }

    const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const priceId = process.env.STRIPE_PRICE_ID || process.env.STRIPE_CANADA_PRICE_ID;
    if (!configuredSiteUrl || !priceId) throw new Error("Payment configuration is incomplete");

    const siteUrl = new URL(configuredSiteUrl).origin;
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${siteUrl}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/canada/apply`,
      metadata: { email, name, product: "canada" },
      customer_email: email,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Checkout session error", error);
    return NextResponse.json({ error: "Unable to start checkout. Please try again." }, { status: 500 });
  }
}
