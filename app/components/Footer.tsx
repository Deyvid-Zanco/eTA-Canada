import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

const COMPANY = "Heliza Giovana Conrado de Andrade Chacha";
const CNPJ = "43.274.527/0001-17";
const ADDRESS = "Averrois, 96 — Brazil";
const EMAIL = "contato@immi-center.com";
const OFFICIAL_ETA_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta/apply.html";

function SiteFooter() {
  return (
    <footer className="editorial-footer">
      <div className="editorial-shell editorial-footer__grid">
        <div className="editorial-footer__brand">
          <p className="editorial-footer__wordmark">IMMI WORLD</p>
          <p>
            Independent private Canada eTA application assistance. We are not a government website, do not issue eTAs, and cannot guarantee approval or processing time.
          </p>
          <a href={OFFICIAL_ETA_URL} target="_blank" rel="noopener noreferrer">
            Apply directly on the official Canada.ca website
          </a>
        </div>

        <div>
          <h2>Company</h2>
          <ul>
            <li>{COMPANY}</li>
            <li>CNPJ {CNPJ}</li>
            <li className="editorial-footer__icon-row"><MapPin aria-hidden="true" /> {ADDRESS}</li>
            <li className="editorial-footer__icon-row"><Mail aria-hidden="true" /> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
          </ul>
        </div>

        <div>
          <h2>Legal</h2>
          <nav>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/refund">Refund Policy</Link>
            <Link href="/delivery">Service Delivery</Link>
            <Link href="/cookies">Cookie Policy</Link>
          </nav>
        </div>
      </div>
      <div className="editorial-shell editorial-footer__bottom">
        <p>© {new Date().getFullYear()} IMMI WORLD. All rights reserved.</p>
        <p>Optional paid service. Government fees are separate.</p>
      </div>
    </footer>
  );
}

export function CanadaFooter() {
  return <SiteFooter />;
}

export function GeneralFooter() {
  return <SiteFooter />;
}

export default CanadaFooter;
