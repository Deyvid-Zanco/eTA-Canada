import type { Metadata } from "next";
import { GeneralFooter } from "../components/Footer";
import { GeneralHeader } from "../components/Header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How IMMI WORLD collects, uses, shares, and protects personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <GeneralHeader />
      <main className="mx-auto max-w-4xl px-5 py-14 text-slate-700">
        <p className="text-sm font-bold uppercase tracking-widest text-[#a71924]">Legal information</p>
        <h1 className="mt-3 text-4xl font-bold text-[#071a31]">Privacy Policy</h1>
        <p className="mt-4 text-sm text-slate-500">Last updated: August 10, 2026</p>

        <div className="mt-8 space-y-8 leading-7">
          <section>
            <h2 className="text-2xl font-bold text-[#071a31]">Who controls your information</h2>
            <p className="mt-3">
              IMMI WORLD is an independent private service operated by Heliza Giovana Conrado de Andrade Chacha, CNPJ 43.274.527/0001-17, at Averrois, 96, Brazil. Contact: <a className="font-semibold text-blue-800 underline" href="mailto:contato@immi-center.com">contato@immi-center.com</a>.
            </p>
            <p className="mt-3">We are not affiliated with the Government of Canada. Any Brazilian tourism registration relates only to our Brazilian business activity and is not Canadian government authorization or endorsement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071a31]">Information we collect</h2>
            <p className="mt-3">We collect the contact, identity, passport, employment, address, travel, and eligibility information you enter in the assistance form, along with your consent and service communications. Stripe processes payment information; we do not receive or store your full card number.</p>
            <p className="mt-3">We may also receive technical information such as IP address, browser details, security signals, referral information, and analytics or advertising events when those tools are active.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071a31]">Why we use information</h2>
            <p className="mt-3">We use information to provide the requested private review and guidance, communicate with you, process and confirm payment, detect abuse, maintain security, comply with legal obligations, and resolve support or refund requests.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071a31]">Service providers and international processing</h2>
            <p className="mt-3">Information may be processed by providers that support this service, including Cloudflare for hosting and security, Stripe for payments, Resend for email delivery, Google reCAPTCHA and Google Ads for security and conversion measurement, and Microsoft Clarity for analytics when enabled.</p>
            <p className="mt-3">These providers may process information in countries outside Brazil. Their own privacy terms and safeguards also apply. We disclose information to public authorities only where legally required or when you specifically direct and authorize the next step.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071a31]">Retention and security</h2>
            <p className="mt-3">We retain information only for as long as reasonably necessary to provide the service, document transactions, resolve disputes, and meet legal or accounting obligations. Access is limited to people and providers who need the information for these purposes.</p>
            <p className="mt-3">No online service can promise absolute security. We use administrative and technical measures intended to reduce unauthorized access, alteration, disclosure, or loss.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#071a31]">Your choices and rights</h2>
            <p className="mt-3">Depending on the law that applies to you, you may request access, correction, confirmation of processing, deletion where permitted, information about sharing, or withdrawal of consent. Email us with enough information to verify and answer your request. Do not send a passport number by ordinary email.</p>
          </section>
        </div>
      </main>
      <GeneralFooter />
    </>
  );
}
