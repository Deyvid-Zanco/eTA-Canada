"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  CircleCheck,
  FileCheck2,
  FileSearch2,
  Headphones,
  LockKeyhole,
  Send,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { CanadaHeader } from "../components/Header";
import { CanadaFooter } from "../components/Footer";
import { useLanguage } from "../../lib/contexts/LanguageContext";

const OFFICIAL_ETA_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta/apply.html";

const content = {
  en: {
    eyebrow: "Independent travel assistance",
    title: "Independent support for your Canada eTA application",
    subtitle:
      "We help you review and organize your information before submission. Final decisions are made solely by Canadian immigration authorities.",
    primary: "Start assisted application",
    secondary: "Apply directly on Canada.ca",
    assurance: "No approval guarantees. All fees are shown before payment.",
    cardTitle: "Private assistance for your Canada eTA",
    features: [
      ["Personal review", "We check your information for clarity and completeness."],
      ["Application guidance", "Plain-language support through the form."],
      ["Document checklist", "A clear list of the information you should prepare."],
    ],
    serviceFee: "Private assistance fee",
    servicePrice: "US$42",
    officialFee: "Official government fee: CAN$7",
    feeNote:
      "Our fee is separate from the Canadian government fee. You will see the total again before payment.",
    processTitle: "Simple, transparent process",
    process: [
      ["Share your information", "Complete our secure form with your travel and passport details."],
      ["We review and organize", "Our team checks the information for completeness and consistency."],
      ["You stay informed", "We provide guidance and communicate the next steps by email."],
    ],
    roleNotice:
      "IMMI WORLD provides private administrative assistance. We do not issue eTAs and cannot influence a government decision.",
    includesTitle: "What our service includes",
    includes: [
      "Review for completeness and common inconsistencies",
      "Plain-language guidance while completing the form",
      "Document and information checklist",
      "Email support about the assistance service",
    ],
    excludesTitle: "What our service does not include",
    excludes: [
      "A guarantee of approval or processing time",
      "A government decision on your application",
      "Government, biometric, medical or third-party fees",
      "Legal advice or regulated immigration representation",
    ],
    privacy: "Your personal information is handled according to our Privacy Policy.",
    pricingTitle: "Clear fees. No surprises.",
    pricingSubtitle: "The private assistance fee and the official fee are separate.",
    assistanceDescription: "One-time payment for our review and guidance service.",
    governmentDescription: "Set by the Government of Canada for an eTA application.",
    faqTitle: "Frequently asked questions",
    faqs: [
      ["Is IMMI WORLD a government website?", "No. We are an independent private consultancy and are not affiliated with the Government of Canada."],
      ["Can you guarantee approval?", "No. Only Canadian immigration authorities decide an eTA application. We cannot guarantee an outcome or processing time."],
      ["Can I apply without your service?", "Yes. Our assistance is optional. You can apply directly through the official Canada.ca website and pay only the official CAN$7 fee."],
      ["What does the US$42 payment cover?", "It covers IMMI WORLD's private review and guidance service. It is separate from the official government fee."],
      ["Who issues the eTA?", "The eTA is issued only by the Government of Canada. IMMI WORLD provides administrative assistance and does not issue travel authorizations."],
    ],
    finalTitle: "Ready for guided assistance?",
    finalText: "Review the service and fees, then begin when you are comfortable.",
  },
  es: {
    eyebrow: "Asistencia de viaje independiente",
    title: "Asistencia independiente para tu solicitud de eTA de Canadá",
    subtitle:
      "Te ayudamos a revisar y organizar tu información. Las autoridades migratorias canadienses toman la decisión final.",
    primary: "Iniciar solicitud asistida",
    secondary: "Solicitar directamente en Canada.ca",
    assurance: "No garantizamos la aprobación. Mostramos todas las tarifas antes del pago.",
    cardTitle: "Asistencia privada para tu eTA de Canadá",
    features: [
      ["Revisión personal", "Revisamos la claridad y consistencia de tu información."],
      ["Orientación", "Ayuda en lenguaje claro durante el formulario."],
      ["Lista de documentos", "Una lista clara de la información que debes preparar."],
    ],
    serviceFee: "Tarifa de asistencia privada",
    servicePrice: "US$42",
    officialFee: "Tarifa oficial del gobierno: CAN$7",
    feeNote: "Nuestra tarifa es independiente de la tarifa del Gobierno de Canadá.",
    processTitle: "Proceso simple y transparente",
    process: [
      ["Comparte tu información", "Completa nuestro formulario seguro con tus datos."],
      ["Revisamos y organizamos", "Nuestro equipo verifica la integridad y consistencia."],
      ["Te mantenemos informado", "Enviamos orientación y próximos pasos por correo electrónico."],
    ],
    roleNotice: "IMMI WORLD brinda asistencia administrativa privada. No emite eTAs ni puede influir en una decisión gubernamental.",
    includesTitle: "Qué incluye nuestro servicio",
    includes: ["Revisión de integridad", "Orientación en lenguaje claro", "Lista de documentos", "Soporte por correo electrónico"],
    excludesTitle: "Qué no incluye nuestro servicio",
    excludes: ["Garantía de aprobación o plazo", "Decisión gubernamental", "Tasas gubernamentales o de terceros", "Asesoramiento legal o representación migratoria regulada"],
    privacy: "Tratamos tu información personal de acuerdo con nuestra Política de Privacidad.",
    pricingTitle: "Tarifas claras. Sin sorpresas.",
    pricingSubtitle: "La tarifa de asistencia privada y la tarifa oficial son independientes.",
    assistanceDescription: "Pago único por nuestro servicio de revisión y orientación.",
    governmentDescription: "Establecida por el Gobierno de Canadá para una solicitud de eTA.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      ["¿IMMI WORLD es un sitio gubernamental?", "No. Somos una consultoría privada independiente sin afiliación con el Gobierno de Canadá."],
      ["¿Pueden garantizar la aprobación?", "No. Solo las autoridades canadienses deciden una solicitud de eTA."],
      ["¿Puedo solicitar sin este servicio?", "Sí. Nuestra asistencia es opcional. Puedes usar Canada.ca y pagar únicamente la tarifa oficial de CAN$7."],
      ["¿Qué cubre el pago de US$42?", "Cubre la revisión y orientación privada de IMMI WORLD. Es independiente de la tarifa oficial."],
      ["¿Quién emite la eTA?", "Solo el Gobierno de Canadá emite la eTA. IMMI WORLD no emite autorizaciones de viaje."],
    ],
    finalTitle: "¿Listo para recibir asistencia?",
    finalText: "Revisa el servicio y las tarifas y comienza cuando estés conforme.",
  },
};

export default function CanadaLandingPage() {
  const { language } = useLanguage();
  const c = content[language];

  return (
    <>
      <CanadaHeader />
      <main className="canada-landing">
        <section className="canada-hero">
          <Image
            src="/hero.png"
            alt="Mountain lake in Canada"
            fill
            priority
            sizes="100vw"
            className="canada-hero-image"
          />
          <div className="canada-hero-overlay" />
          <div className="canada-shell canada-hero-grid">
            <div className="canada-hero-copy">
              <p className="canada-eyebrow">{c.eyebrow}</p>
              <h1>{c.title}</h1>
              <p className="canada-hero-subtitle">{c.subtitle}</p>
              <div className="canada-hero-actions">
                <Link href="/canada/apply" className="canada-button canada-button-primary">
                  {c.primary}
                </Link>
                <a href={OFFICIAL_ETA_URL} target="_blank" rel="noopener noreferrer" className="canada-button canada-button-secondary">
                  {c.secondary}
                </a>
              </div>
              <p className="canada-assurance"><ShieldCheck aria-hidden="true" /> {c.assurance}</p>
            </div>

            <aside className="canada-service-card" aria-label={c.cardTitle}>
              <h2>{c.cardTitle}</h2>
              <div className="canada-feature-list">
                {c.features.map(([title, description], index) => {
                  const Icon = index === 0 ? CircleCheck : index === 1 ? FileCheck2 : ShieldCheck;
                  return (
                    <div className="canada-feature" key={title}>
                      <span className="canada-icon"><Icon aria-hidden="true" /></span>
                      <div><h3>{title}</h3><p>{description}</p></div>
                    </div>
                  );
                })}
              </div>
              <div className="canada-price-card">
                <p>{c.serviceFee}</p>
                <strong>{c.servicePrice}</strong>
                <span>{c.officialFee}</span>
                <small>{c.feeNote}</small>
              </div>
            </aside>
          </div>
        </section>

        <section id="how-it-works" className="canada-section canada-process">
          <div className="canada-shell">
            <p className="canada-section-kicker">IMMI WORLD</p>
            <h2>{c.processTitle}</h2>
            <div className="canada-process-grid">
              {c.process.map(([title, description], index) => {
                const Icon = index === 0 ? UploadCloud : index === 1 ? FileSearch2 : Send;
                return <article key={title}>
                  <span className="canada-step">{index + 1}</span>
                  <Icon className="canada-process-icon" aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>;
              })}
            </div>
            <div className="canada-role-notice"><ShieldCheck aria-hidden="true" /><p>{c.roleNotice}</p></div>
          </div>
        </section>

        <section className="canada-section canada-includes">
          <div className="canada-shell">
            <h2>{c.includesTitle}</h2>
            <div className="canada-includes-grid">
              <article className="canada-list-panel canada-list-positive">
                <h3><CircleCheck aria-hidden="true" />{c.includesTitle}</h3>
                <ul>{c.includes.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
              </article>
              <article className="canada-list-panel canada-list-neutral">
                <h3><ShieldCheck aria-hidden="true" />{c.excludesTitle}</h3>
                <ul>{c.excludes.map((item) => <li key={item}><span aria-hidden="true">—</span>{item}</li>)}</ul>
              </article>
            </div>
            <div className="canada-privacy-strip"><LockKeyhole aria-hidden="true" /><p>{c.privacy} <Link href="/privacy">Privacy Policy</Link></p></div>
          </div>
        </section>

        <section id="pricing" className="canada-section canada-pricing">
          <div className="canada-shell canada-narrow">
            <h2>{c.pricingTitle}</h2>
            <p className="canada-section-intro">{c.pricingSubtitle}</p>
            <div className="canada-pricing-grid">
              <article>
                <Headphones aria-hidden="true" />
                <p>{c.serviceFee}</p>
                <strong>{c.servicePrice}</strong>
                <span>{c.assistanceDescription}</span>
              </article>
              <article>
                <FileCheck2 aria-hidden="true" />
                <p>{c.officialFee}</p>
                <strong>CAN$7</strong>
                <span>{c.governmentDescription}</span>
              </article>
            </div>
          </div>
        </section>

        <section id="faq" className="canada-section canada-faq">
          <div className="canada-shell canada-narrow">
            <h2>{c.faqTitle}</h2>
            <div className="canada-faq-list">
              {c.faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}<ChevronDown aria-hidden="true" /></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="canada-final-cta">
          <div className="canada-shell">
            <div><h2>{c.finalTitle}</h2><p>{c.finalText}</p></div>
            <div className="canada-final-actions">
              <Link href="/canada/apply" className="canada-button canada-button-primary">{c.primary}</Link>
              <a href={OFFICIAL_ETA_URL} target="_blank" rel="noopener noreferrer">{c.secondary}</a>
            </div>
          </div>
        </section>
      </main>
      <CanadaFooter />
    </>
  );
}
