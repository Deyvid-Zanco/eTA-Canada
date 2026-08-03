import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  fulfillCheckoutSession,
  getStripeClient,
} from "@/lib/payment-fulfillment";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook is not configured" },
      { status: 500 },
    );
  }

  let event: Stripe.Event;

  try {
    const payload = await req.text();
    event = await getStripeClient().webhooks.constructEventAsync(
      payload,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Invalid Stripe webhook signature", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await fulfillCheckoutSession(session.id);
    } catch (error) {
      console.error("Stripe webhook fulfillment failed", error);
      return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
