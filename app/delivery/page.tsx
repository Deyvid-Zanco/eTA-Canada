import type { Metadata } from "next";
import { GeneralHeader } from "../components/Header";
import { GeneralFooter } from "../components/Footer";

export const metadata: Metadata = {
  title: "Service Delivery",
  description: "Scope and delivery of IMMI WORLD private Canada eTA application assistance.",
  alternates: { canonical: "/delivery" },
};

export default function DeliveryPage() {
  return (
    <>
      <GeneralHeader />
      <main className="mx-auto max-w-4xl px-5 py-14 text-slate-700">
        <p className="text-sm font-bold uppercase tracking-widest text-[#cf2431]">Service information</p>
        <h1 className="mt-3 text-4xl font-bold text-[#071b34]">Service Delivery</h1>
        <div className="mt-8 space-y-8 leading-7">
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">What you purchase</h2>
            <p className="mt-3">The US$42 Canada service fee covers private administrative guidance and a review of the information supplied to IMMI WORLD. It does not include the official CAN$7 government fee or any other third-party charge.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">How delivery works</h2>
            <p className="mt-3">After payment confirmation, our team reviews the information and communicates guidance or requests for clarification using the email provided with the order. Delivery of our assistance is electronic.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">No government processing promise</h2>
            <p className="mt-3">IMMI WORLD cannot control government processing, request priority treatment, issue an eTA or guarantee a decision. Do not make non-refundable travel arrangements based solely on an expected result date.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">Support</h2>
            <p className="mt-3">For questions about delivery of the private assistance service, contact <a className="font-semibold text-blue-800 underline" href="mailto:contato@immi-center.com">contato@immi-center.com</a>.</p>
          </section>
        </div>
      </main>
      <GeneralFooter />
    </>
  );
}
