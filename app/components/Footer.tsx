"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../lib/contexts/LanguageContext";

const COMPANY = "Heliza Giovana Conrado de Andrade Chacha";
const CNPJ = "43.274.527/0001-17";
const ADDRESS = "Averrois, 96 — Brazil";
const EMAIL = "immiworldcenter@gmail.com";

export function CanadaFooter() {
  const { language } = useLanguage();
  const es = language === "es";

  return (
    <footer id="contact" className="bg-[#071b34] py-14 text-sm text-slate-300">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-xl font-black tracking-[0.04em] text-white">IMMI WORLD</p>
          <p className="mt-1 text-xs font-semibold tracking-wide text-slate-400">Private travel assistance</p>
          <p className="mt-5 max-w-lg leading-6">
            {es
              ? "Consultoría privada independiente. No somos parte del Gobierno de Canadá y no emitimos autorizaciones de viaje. Nuestra asistencia es opcional."
              : "Independent private consultancy. We are not part of the Government of Canada and do not issue travel authorizations. Our assistance is optional."}
          </p>
          <a
            href="https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta/apply.html"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-semibold text-white underline underline-offset-4"
          >
            {es ? "Solicitar directamente en Canada.ca" : "Apply directly on Canada.ca"}
          </a>
        </div>

        <div>
          <h2 className="font-bold text-white">{es ? "Empresa y contacto" : "Company and contact"}</h2>
          <ul className="mt-4 grid gap-3">
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" /><a href={`mailto:${EMAIL}`} className="hover:text-white">{EMAIL}</a></li>
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" /><span>{ADDRESS}</span></li>
            <li><strong className="text-white">CNPJ:</strong> {CNPJ}</li>
            <li>{COMPANY}</li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-white">{es ? "Información legal" : "Legal information"}</h2>
          <nav className="mt-4 grid gap-3">
            <Link href="/terms" className="hover:text-white">{es ? "Términos del servicio" : "Terms of Service"}</Link>
            <Link href="/privacy" className="hover:text-white">{es ? "Política de privacidad" : "Privacy Policy"}</Link>
            <Link href="/refund" className="hover:text-white">{es ? "Política de reembolso" : "Refund Policy"}</Link>
            <Link href="/delivery" className="hover:text-white">{es ? "Alcance del servicio" : "Service Delivery"}</Link>
            <Link href="/cookies" className="hover:text-white">{es ? "Política de cookies" : "Cookie Policy"}</Link>
          </nav>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1180px] flex-col gap-3 border-t border-slate-700 px-5 pt-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} IMMI WORLD. {es ? "Todos los derechos reservados." : "All rights reserved."}</p>
        <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" aria-hidden="true" />{es ? "Sin garantía de aprobación o plazo." : "No approval or processing-time guarantee."}</p>
      </div>
    </footer>
  );
}

export function PhilippinesFooter() {
  return (
    <footer id="contact" className="mt-16 bg-slate-100 py-10 text-sm">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 md:flex-row">
        <div className="max-w-3xl">
          <Image src="/logo-phillipines.png" alt="IMMI WORLD Philippines" width={160} height={40} />
          <p className="mt-4 text-xs leading-6 text-slate-600">IMMI WORLD is an independent private travel consultancy and is not affiliated with a government agency. CNPJ {CNPJ}.</p>
        </div>
        <div className="grid gap-2">
          <Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/refund">Refunds</Link><a href={`mailto:${EMAIL}`}>Contact</a>
        </div>
      </div>
    </footer>
  );
}

export function GeneralFooter() {
  return (
    <footer id="contact" className="mt-16 bg-[#071b34] py-10 text-sm text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-2">
        <div>
          <p className="text-xl font-black tracking-wide text-white">IMMI WORLD</p>
          <p className="mt-4 max-w-2xl leading-6">Independent private travel consultancy. We are not affiliated with any government agency and cannot guarantee a decision or processing time.</p>
          <p className="mt-3">{COMPANY} — CNPJ {CNPJ}</p>
        </div>
        <nav className="grid content-start gap-3 md:justify-self-end">
          <Link href="/terms">Terms and Conditions</Link><Link href="/privacy">Privacy Policy</Link><Link href="/refund">Refund Policy</Link><Link href="/delivery">Service Delivery</Link><a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </nav>
      </div>
    </footer>
  );
}

export default CanadaFooter;
