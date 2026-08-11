"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { CanadaFooter } from "../components/Footer";
import { CanadaHeader } from "../components/Header";

export default function ThankYouPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const sessionId = new URL(window.location.href).searchParams.get("session_id");
    if (!sessionId) return;

    setStatus("sending");
    fetch("/api/payment-success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) throw new Error("Payment confirmation failed");
        setStatus("sent");
        if (typeof window.gtag === "function") {
          window.gtag("event", "conversion", {
            send_to: "AW-16512154233/tQOZCLmLoaAZEPn0zcE9",
            value: 42,
            currency: "USD",
            transaction_id: sessionId,
          });
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-16512154233" />
      <Script id="google-ads-tag">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','AW-16512154233');`}
      </Script>
      <CanadaHeader />
      <main className="application-page flex items-center">
        <section className="application-card text-center" aria-labelledby="confirmation-title">
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-700" aria-hidden="true" />
          <p className="editorial-eyebrow mt-6">Payment received</p>
          <h1 id="confirmation-title" className="mt-3 font-serif text-4xl font-bold text-[#071a31]">Thank you for choosing our private assistance</h1>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
            We received your payment. Our team can now review the information you supplied and contact you by email about the next steps.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            IMMI WORLD is not affiliated with the Government of Canada, does not issue eTAs, and cannot guarantee approval or processing time.
          </p>
          {status === "sending" && <p className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600"><LoaderCircle className="h-4 w-4 animate-spin" /> Confirming your payment...</p>}
          {status === "sent" && <p className="mt-6 text-sm font-semibold text-green-700">A payment confirmation was sent to your email.</p>}
          {status === "error" && <p className="mt-6 text-sm font-semibold text-red-700">We could not send the confirmation email. Your payment record is still available; contact us for help.</p>}
          <div className="editorial-actions justify-center">
            <Link href="/" className="editorial-button editorial-button--primary">Return to home</Link>
            <a href="mailto:contato@immi-center.com" className="editorial-button editorial-button--link">Contact support</a>
          </div>
        </section>
      </main>
      <CanadaFooter />
    </>
  );
}
