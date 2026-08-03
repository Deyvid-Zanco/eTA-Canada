"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../../lib/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export function PhilippinesHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="bg-blue-700 px-4 py-2 text-center text-xs font-semibold text-white">
        Private travel assistance service — not a government website
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/philippines">
          <Image src="/logo-phillipines.png" alt="IMMI WORLD Philippines" width={210} height={64} priority />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
          <Link href="/philippines">Home</Link>
          <Link href="/philippines#faq">FAQ</Link>
          <a href="mailto:immiworldcenter@gmail.com">Contact</a>
          <Link href="/philippines/apply" className="rounded bg-blue-700 px-4 py-2.5 text-white">Start</Link>
        </nav>
        <button className="rounded p-2 md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav className="grid gap-2 border-t border-slate-200 px-5 py-4 text-sm font-semibold md:hidden">
          <Link href="/philippines" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/philippines#faq" onClick={() => setOpen(false)}>FAQ</Link>
          <a href="mailto:immiworldcenter@gmail.com">Contact</a>
          <Link href="/philippines/apply" className="rounded bg-blue-700 px-4 py-3 text-center text-white" onClick={() => setOpen(false)}>Start</Link>
        </nav>
      )}
    </header>
  );
}

export function GeneralHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="bg-[#071b34] px-4 py-2 text-center text-xs font-semibold text-white">
        IMMI WORLD is an independent private travel consultancy and is not a government website.
      </div>
      <div className="mx-auto flex max-w-7xl items-center px-5 py-4">
        <Link href="/" className="leading-none" aria-label="IMMI WORLD home">
          <span className="block text-xl font-black tracking-[0.04em] text-[#071b34]">IMMI WORLD</span>
          <span className="mt-1 block text-[11px] font-medium tracking-wide text-slate-500">Private travel assistance</span>
        </Link>
      </div>
    </header>
  );
}

export function CanadaHeader() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const labels = language === "es" ? {
    disclosure: "Servicio privado de asistencia — no es un sitio web gubernamental",
    how: "Cómo funciona", pricing: "Tarifas", faq: "Preguntas", contact: "Contacto", action: "Iniciar asistencia",
  } : {
    disclosure: "Private assistance service — not a government website",
    how: "How it works", pricing: "Pricing", faq: "FAQ", contact: "Contact", action: "Start assisted application",
  };

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="bg-[#071b34] py-2 text-white">
        <p className="mx-auto max-w-[1180px] px-4 text-center text-xs font-semibold tracking-wide">{labels.disclosure}</p>
      </div>
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4">
        <Link href="/canada" className="leading-none" aria-label="IMMI WORLD Canada home">
          <span className="block text-xl font-black tracking-[0.04em] text-[#071b34]">IMMI WORLD</span>
          <span className="mt-1 block text-[11px] font-medium tracking-wide text-slate-500">Private travel assistance</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold md:flex" aria-label="Main navigation">
          <Link href="/canada#how-it-works" className="text-slate-700 hover:text-[#b51c28]">{labels.how}</Link>
          <Link href="/canada#pricing" className="text-slate-700 hover:text-[#b51c28]">{labels.pricing}</Link>
          <Link href="/canada#faq" className="text-slate-700 hover:text-[#b51c28]">{labels.faq}</Link>
          <a href="mailto:immiworldcenter@gmail.com" className="text-slate-700 hover:text-[#b51c28]">{labels.contact}</a>
          <LanguageSwitcher />
          <Link href="/canada/apply" className="rounded bg-[#cf2431] px-4 py-2.5 text-white hover:bg-[#b51c28]">{labels.action}</Link>
        </nav>
        <button className="rounded-md p-2 text-[#071b34] md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-slate-200 px-5 py-4 text-sm font-semibold md:hidden">
          <Link href="/canada#how-it-works" className="rounded px-3 py-3 hover:bg-slate-50" onClick={close}>{labels.how}</Link>
          <Link href="/canada#pricing" className="rounded px-3 py-3 hover:bg-slate-50" onClick={close}>{labels.pricing}</Link>
          <Link href="/canada#faq" className="rounded px-3 py-3 hover:bg-slate-50" onClick={close}>{labels.faq}</Link>
          <a href="mailto:immiworldcenter@gmail.com" className="rounded px-3 py-3 hover:bg-slate-50">{labels.contact}</a>
          <div className="border-t border-slate-200 px-3 pt-4"><LanguageSwitcher /></div>
          <Link href="/canada/apply" className="mt-3 rounded bg-[#cf2431] px-4 py-3 text-center text-white" onClick={close}>{labels.action}</Link>
        </nav>
      )}
    </header>
  );
}

export default CanadaHeader;
