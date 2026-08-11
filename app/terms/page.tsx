import type { Metadata } from "next";
import { GeneralHeader } from "../components/Header";
import { GeneralFooter } from "../components/Footer";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms for IMMI WORLD optional private Canada eTA application assistance.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <GeneralHeader />
      <main className="mx-auto max-w-4xl px-5 py-14 text-slate-700">
        <p className="text-sm font-bold uppercase tracking-widest text-[#cf2431]">Legal information</p>
        <h1 className="mt-3 text-4xl font-bold text-[#071b34]">Terms and Conditions</h1>
        <div className="mt-8 space-y-8 leading-7">
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">Who we are</h2>
            <p className="mt-3">IMMI WORLD is an independent private travel consultancy operated by Heliza Giovana Conrado de Andrade Chacha, CNPJ 43.274.527/0001-17. We are not the Government of Canada, an embassy, a consulate or an immigration authority.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">Scope of the service</h2>
            <p className="mt-3">Our optional paid service helps clients organize and review information used in a Canada eTA application. We provide administrative guidance and a completeness review. We do not issue eTAs, make government decisions, provide legal advice or guarantee approval or processing time.</p>
            <p className="mt-3">Clients may apply without our assistance through the official Canada.ca website. Choosing IMMI WORLD is voluntary.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">Fees</h2>
            <p className="mt-3">The Canada assistance service costs US$42. The official Canada eTA application fee is CAN$7 and is separate from our service fee. Any additional third-party, medical or biometric cost is also separate unless expressly stated before payment.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">Client responsibilities</h2>
            <p className="mt-3">You are responsible for providing complete and truthful information, checking the final information and complying with requests from Canadian authorities. Assistance from IMMI WORLD does not change eligibility requirements or the authority&apos;s decision.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">Contact</h2>
            <p className="mt-3">Questions about these terms may be sent to <a className="font-semibold text-blue-800 underline" href="mailto:contato@immi-center.com">contato@immi-center.com</a>.</p>
          </section>
        </div>
      </main>
      <GeneralFooter />
    </>
  );
}
