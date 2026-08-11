import type { Metadata } from "next";
import { GeneralHeader } from "../components/Header";
import { GeneralFooter } from "../components/Footer";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund conditions for IMMI WORLD private Canada eTA assistance.",
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <>
      <GeneralHeader />
      <main className="mx-auto max-w-4xl px-5 py-14 text-slate-700">
        <p className="text-sm font-bold uppercase tracking-widest text-[#cf2431]">Legal information</p>
        <h1 className="mt-3 text-4xl font-bold text-[#071b34]">Refund Policy</h1>
        <div className="mt-8 space-y-6 leading-7">
          <p>This policy applies to the private IMMI WORLD assistance fee. Government and third-party fees are controlled by their respective providers and are not part of our service fee.</p>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">Before our review begins</h2>
            <p className="mt-3">You may request cancellation by email. If our team has not started reviewing or organizing the information, the private assistance fee will be refunded in full.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">After work begins</h2>
            <p className="mt-3">If review or guidance work has started, the request will be assessed according to the work already delivered and applicable consumer law. A decision by Canadian authorities is outside our control and does not mean that IMMI WORLD made or influenced that decision.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">How to request a refund</h2>
            <p className="mt-3">Email <a className="font-semibold text-blue-800 underline" href="mailto:contato@immi-center.com">contato@immi-center.com</a> with the purchaser&apos;s name, order email, Stripe payment reference if available, and the reason for the request. Do not send a passport number by ordinary email unless our support team specifically provides a secure method.</p>
          </section>
          <p>Approved refunds are returned to the original payment method. Your bank or card provider controls when the credit appears on your statement.</p>
        </div>
      </main>
      <GeneralFooter />
    </>
  );
}
