"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="editorial-header">
      <div className="editorial-disclosure">
        Independent private service — not affiliated with the Government of Canada
      </div>
      <div className="editorial-shell editorial-header__main">
        <Link href="/" className="editorial-wordmark" aria-label="IMMI WORLD home">
          <strong>IMMI WORLD</strong>
          <span>Canada eTA application assistance</span>
        </Link>

        <nav className="editorial-nav editorial-nav--desktop" aria-label="Main navigation">
          <Link href="/#service">Service</Link>
          <Link href="/#process">Process</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/#faq">FAQ</Link>
          <a href="mailto:contato@immi-center.com">Contact</a>
          <Link href="/canada/apply" className="editorial-nav__cta">Start application</Link>
        </nav>

        <button
          type="button"
          className="editorial-menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-navigation" className="editorial-nav editorial-nav--mobile" aria-label="Mobile navigation">
          <Link href="/#service" onClick={close}>Service</Link>
          <Link href="/#process" onClick={close}>Process</Link>
          <Link href="/#pricing" onClick={close}>Pricing</Link>
          <Link href="/#faq" onClick={close}>FAQ</Link>
          <a href="mailto:contato@immi-center.com">Contact</a>
          <Link href="/canada/apply" className="editorial-nav__cta" onClick={close}>Start application</Link>
        </nav>
      )}
    </header>
  );
}

export function GeneralHeader() {
  return <SiteHeader />;
}

export function CanadaHeader() {
  return <SiteHeader />;
}
