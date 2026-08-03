import { Resend } from "resend";
import Stripe from "stripe";

export type FulfillmentResult = {
  success: true;
  alreadyProcessed: boolean;
};

export function getStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }

  return new Stripe(apiKey, { apiVersion: "2025-06-30.basil" });
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }

  return new Resend(apiKey);
}

export async function fulfillCheckoutSession(
  sessionId: string,
): Promise<FulfillmentResult> {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    throw new Error("Payment is not complete");
  }

  if (session.metadata?.payment_email_sent === "true") {
    return { success: true, alreadyProcessed: true };
  }

  const email =
    session.customer_email ||
    session.customer_details?.email ||
    session.metadata?.email;

  if (!email) {
    throw new Error("Checkout Session does not contain a customer email");
  }

  const product = session.metadata?.product || "canada";
  const travelMethod = session.metadata?.travel_method;
  const travelType = session.metadata?.travel_type;
  const resend = getResendClient();

  if (product === "philippines" && travelMethod && travelType) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      throw new Error("NEXT_PUBLIC_SITE_URL environment variable is not set");
    }

    const formPath = travelMethod === "Cruise" ? "/forms/cruise" : "/forms/flight";
    const formUrl = new URL(formPath, siteUrl);
    formUrl.searchParams.set("mode", travelType.toLowerCase());
    formUrl.searchParams.set("session_id", session.id);
    formUrl.searchParams.set("email", email);

    const { error } = await resend.emails.send(
      {
        from: "IMMI WORLD <noreply@immicenter-online.com>",
        to: email,
        subject: "Payment received — next step for your private travel assistance",
        html: `
          <h1>Payment received</h1>
          <p>We received your payment for IMMI WORLD's private travel assistance service.</p>
          <p>Complete your ${travelMethod.toLowerCase()} details using the secure link below:</p>
          <p><a href="${formUrl.toString()}">Continue your application details</a></p>
          <p>We are a private service and cannot guarantee a government decision or processing time.</p>
        `,
      },
      { idempotencyKey: `payment-confirmation/${session.id}` },
    );

    if (error) throw new Error(error.message);
  } else {
    const { error } = await resend.emails.send(
      {
        from: "IMMI WORLD <noreply@immicenter-online.com>",
        to: email,
        subject: "Payment received — private Canada eTA assistance",
        html: `
          <h1>Payment received</h1>
          <p>We received your payment for IMMI WORLD's optional private review and guidance service.</p>
          <p>Our team can now review the information you supplied and contact you about the next steps.</p>
          <p>IMMI WORLD does not issue eTAs and cannot guarantee a government decision or processing time.</p>
        `,
      },
      { idempotencyKey: `payment-confirmation/${session.id}` },
    );

    if (error) throw new Error(error.message);
  }

  await stripe.checkout.sessions.update(session.id, {
    metadata: {
      ...session.metadata,
      payment_email_sent: "true",
    },
  });

  return { success: true, alreadyProcessed: false };
}
