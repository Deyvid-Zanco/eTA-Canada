import { Resend } from "resend";
import Stripe from "stripe";

export type FulfillmentResult = { success: true; alreadyProcessed: boolean };

export function getStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) throw new Error("STRIPE_SECRET_KEY environment variable is not set");

  return new Stripe(apiKey, {
    apiVersion: "2025-06-30.basil",
    httpClient: Stripe.createFetchHttpClient(),
  });
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY environment variable is not set");
  return new Resend(apiKey);
}

export async function fulfillCheckoutSession(sessionId: string): Promise<FulfillmentResult> {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    throw new Error("Payment is not complete");
  }

  if (session.metadata?.payment_email_sent === "true") {
    return { success: true, alreadyProcessed: true };
  }

  const email = session.customer_email || session.customer_details?.email || session.metadata?.email;
  if (!email) throw new Error("Checkout Session does not contain a customer email");

  const { error } = await getResendClient().emails.send(
    {
      from: "IMMI WORLD <noreply@immicenter-online.com>",
      to: email,
      subject: "Payment received — private Canada eTA assistance",
      html: `
        <h1>Payment received</h1>
        <p>We received your payment for IMMI WORLD's optional private review and guidance service.</p>
        <p>Our team can now review the information you supplied and contact you about the next steps.</p>
        <p>IMMI WORLD is not affiliated with the Government of Canada, does not issue eTAs, and cannot guarantee a government decision or processing time.</p>
      `,
    },
    { idempotencyKey: `payment-confirmation/${session.id}` },
  );

  if (error) throw new Error(error.message);

  await stripe.checkout.sessions.update(session.id, {
    metadata: { ...session.metadata, payment_email_sent: "true" },
  });

  return { success: true, alreadyProcessed: false };
}
