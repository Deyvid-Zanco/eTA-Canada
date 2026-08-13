import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileSearch2,
  MessageCircle,
} from "lucide-react";
import { GeneralFooter } from "./components/Footer";
import { GeneralHeader } from "./components/Header";

const OFFICIAL_ETA_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta/apply.html";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const serviceItems = [
  {
    icon: FileSearch2,
    title: "Application information review",
    copy: "A careful review of the information you provide before the next step.",
  },
  {
    icon: ClipboardCheck,
    title: "Completeness check",
    copy: "We highlight missing or inconsistent details that may need your attention.",
  },
  {
    icon: MessageCircle,
    title: "Next-step guidance",
    copy: "Plain-language guidance and email support throughout our service.",
  },
];

const processSteps = [
  ["01", "Provide your details", "Complete our two-part secure information form."],
  ["02", "Pay the service fee", "The private assistance fee is US$42, shown before checkout."],
  ["03", "Receive our review", "Our team reviews the information and contacts you by email."],
];

const faqs = [
  {
    question: "Is IMMI WORLD part of the Government of Canada?",
    answer:
      "No. IMMI WORLD is an independent private company. We do not represent Immigration, Refugees and Citizenship Canada and we do not issue eTAs.",
  },
  {
    question: "Do I have to use this service?",
    answer:
      "No. Our assistance is optional. You can apply directly through the official Canada.ca website and pay the government fee there.",
  },
  {
    question: "Does the US$42 include the government fee?",
    answer:
      "No. US$42 is our private service fee. The official Government of Canada eTA fee is CAN$7 and is paid separately.",
  },
  {
    question: "Can you guarantee approval or processing time?",
    answer:
      "No. Only the Government of Canada decides an application. We cannot guarantee approval, timing, entry, or influence any government decision.",
  },
];

export default function LandingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IMMI WORLD",
    legalName: "Heliza Giovana Conrado de Andrade Chacha",
    url: "https://www.immicenter-online.com",
    email: "contato@immi-center.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Averrois, 96",
      addressCountry: "BR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GeneralHeader />

      <main>
        <section className="editorial-hero" aria-labelledby="hero-title">
          <Image
            src="/canada-eta-hero.png"
            alt="Canadian waterfront city with mountains in the background"
            fill
            priority
            sizes="100vw"
            className="editorial-hero__image"
          />
          <div className="editorial-shell editorial-hero__content">
            <div className="editorial-hero__copy">
              <p className="editorial-eyebrow">Canada eTA application assistance</p>
              <h1 id="hero-title">A clearer way to prepare your Canada eTA application</h1>
              <p className="editorial-hero__lede">
                Optional private review and guidance to help you organize your application information with care and clarity.
              </p>
              <div className="editorial-actions">
                <Link href="/canada/apply" className="editorial-button editorial-button--primary">
                  Start your application <ArrowRight aria-hidden="true" />
                </Link>
                <a
                  href={OFFICIAL_ETA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-button editorial-button--link"
                >
                  Apply directly on Canada.ca
                </a>
              </div>
              <div className="editorial-price" id="pricing">
                <span>Private service fee</span>
                <strong>US$42</strong>
                <small>Official government fee: CAN$7, paid separately.</small>
              </div>
            </div>
          </div>
        </section>

        <section className="editorial-service" id="service" aria-labelledby="service-title">
          <div className="editorial-shell">
            <div className="editorial-section-heading editorial-section-heading--compact">
              <h2 id="service-title">What you receive</h2>
            </div>
            <div className="editorial-service-grid">
              {serviceItems.map(({ icon: Icon, title, copy }) => (
                <article key={title} className="editorial-service-item">
                  <Icon aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="editorial-process" id="process" aria-labelledby="process-title">
          <div className="editorial-shell editorial-process__layout">
            <div className="editorial-section-heading editorial-section-heading--compact">
              <h2 id="process-title">Our process</h2>
            </div>
            <ol className="editorial-process-grid">
              {processSteps.map(([number, title, copy]) => (
                <li key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="editorial-scope" aria-labelledby="scope-title">
          <div className="editorial-shell editorial-scope__grid">
            <div>
              <p className="editorial-eyebrow">Transparent by design</p>
              <h2 id="scope-title">Know exactly what you are paying for</h2>
              <p>
                IMMI WORLD provides an optional administrative review service. The service can help identify incomplete or inconsistent information, but the applicant remains responsible for accuracy and eligibility.
              </p>
            </div>
            <div className="editorial-scope__card">
              <h3>Our service includes</h3>
              <ul>
                <li><Check aria-hidden="true" /> Information organization and review</li>
                <li><Check aria-hidden="true" /> Completeness and consistency check</li>
                <li><Check aria-hidden="true" /> Email guidance on next steps</li>
              </ul>
              <div className="editorial-scope__price-row">
                <span>Total private service fee</span>
                <strong>US$42</strong>
              </div>
              <p className="editorial-scope__note">Government fees are not included.</p>
            </div>
          </div>
        </section>

        <section className="editorial-faq" id="faq" aria-labelledby="faq-title">
          <div className="editorial-shell editorial-faq__grid">
            <div className="editorial-section-heading">
              <p className="editorial-eyebrow">Questions, answered</p>
              <h2 id="faq-title">Before you begin</h2>
              <p>Clear information helps you decide whether a private assistance service is right for you.</p>
            </div>
            <div className="editorial-faq__list">
              {faqs.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="editorial-cta" aria-labelledby="cta-title">
          <div className="editorial-shell editorial-cta__content">
            <div>
              <p className="editorial-eyebrow">Ready when you are</p>
              <h2 id="cta-title">Prepare your information with confidence</h2>
            </div>
            <Link href="/canada/apply" className="editorial-button editorial-button--light">
              Start private assistance <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <GeneralFooter />
    </>
  );
}
