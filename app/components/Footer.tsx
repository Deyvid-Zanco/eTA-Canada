"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../lib/contexts/LanguageContext";

// Philippines-specific Footer
export function PhilippinesFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-100 mt-16 py-10 text-sm" id="contact">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1 flex flex-col gap-4">
            <Image
              src="/logo-phillipines.png"
              alt="Philippines eTravel Service"
              width={160}
              height={40}
            />
            <p className="text-gray-600 text-xs leading-relaxed break-words">
              {t.footer.disclaimer}&nbsp;
              <a href="https://cadastur.turismo.gov.br/cadastur/#!/public/qrcode/41909350000152" target="_blank" className="underline hover:text-blue-700">{t.footer.cadasturLink}</a>.
              &nbsp;<b>{t.footer.companyInfo}</b>&nbsp;
              <Link href="/terms" className="underline hover:text-blue-700">{t.footer.termsOfUse}</Link> |&nbsp;
              <Link href="/cookies" className="underline hover:text-blue-700">{t.footer.cookiesPolicy}</Link> |&nbsp;
              <Link href="/privacy" className="underline hover:text-blue-700">{t.footer.privacyPolicy}</Link>
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/philippines" className="hover:text-blue-700">
                  Philippines eTravel Home
                </Link>
              </li>
              <li>
                <Link href="/philippines/apply" className="hover:text-blue-700">
                  Apply for eTravel
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-blue-700">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="mailto:info@immi-center.com" className="hover:text-blue-700">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/sslsecure.png"
              alt="SSL Secure"
              width={60}
              height={60}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

// Canada-specific Footer
export function CanadaFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-100 mt-16 py-10 text-sm" id="contact">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1 flex flex-col gap-4">
            <Image
              src="/eta-canada-immi-center-logo-1024x339.png"
              alt="Canada eTA Service"
              width={160}
              height={40}
            />
            <p className="text-gray-600 text-xs leading-relaxed break-words">
              {t.footer.disclaimer}&nbsp;
              <a href="https://cadastur.turismo.gov.br/cadastur/#!/public/qrcode/41909350000152" target="_blank" className="underline hover:text-red-700">{t.footer.cadasturLink}</a>.
              &nbsp;<b>{t.footer.companyInfo}</b>&nbsp;
              <Link href="/terms" className="underline hover:text-red-700">{t.footer.termsOfUse}</Link> |&nbsp;
              <Link href="/cookies" className="underline hover:text-red-700">{t.footer.cookiesPolicy}</Link> |&nbsp;
              <Link href="/privacy" className="underline hover:text-red-700">{t.footer.privacyPolicy}</Link>
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/canada" className="hover:text-red-700">
                  Canada eTA Home
                </Link>
              </li>
              <li>
                <Link href="/canada/apply" className="hover:text-red-700">
                  Apply for eTA
                </Link>
              </li>
              <li>
                <Link href="#eta-info" className="hover:text-red-700">
                  eTA Information
                </Link>
              </li>
              <li>
                <Link href="#benefits" className="hover:text-red-700">
                  Benefits
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/sslsecure.png"
              alt="SSL Secure"
              width={60}
              height={60}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

// General Footer for landing page
export function GeneralFooter() {
  return (
    <footer className="bg-gray-100 mt-16 py-10 text-sm" id="contact">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1 flex flex-col gap-4">
            <Image
              src="/logo-default.png"
              alt="IMMI CENTER"
              width={160}
              height={40}
            />
            <p className="text-gray-600 text-xs leading-relaxed break-words">
              IMMI CENTER provides visa and travel authorization services for multiple destinations worldwide.
              <b> IMMI CENTER - Canada, Philippines</b>&nbsp;
              <Link href="/terms" className="underline hover:text-blue-700">Terms of Use</Link> |&nbsp;
              <Link href="/cookies" className="underline hover:text-blue-700">Cookies Policy</Link> |&nbsp;
              <Link href="/privacy" className="underline hover:text-blue-700">Privacy Policy</Link>
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/canada" className="hover:text-blue-700">
                  🇨🇦 Canada eTA
                </Link>
              </li>
              <li>
                <Link href="/philippines" className="hover:text-blue-700">
                  🇵🇭 Philippines eTravel
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-700">
                  📄 Document Legalization
                </Link>
              </li>
              <li>
                <Link href="mailto:info@immi-center.com" className="hover:text-blue-700">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/sslsecure.png"
              alt="SSL Secure"
              width={60}
              height={60}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

// Default Footer (Canada-specific)
export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-100 mt-16 py-10 text-sm" id="contact">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1 flex flex-col gap-4">
            <Image
              src="/eta-canada-immi-center-logo-1024x339.png"
              alt="Canada eTA Service"
              width={160}
              height={40}
            />
            <p className="text-gray-600 text-xs leading-relaxed break-words">
              {t.footer.disclaimer}&nbsp;
              <a href="https://cadastur.turismo.gov.br/cadastur/#!/public/qrcode/41909350000152" target="_blank" className="underline hover:text-red-700">{t.footer.cadasturLink}</a>.
              &nbsp;<b>{t.footer.companyInfo}</b>&nbsp;
              <Link href="/terms" className="underline hover:text-red-700">{t.footer.termsOfUse}</Link> |&nbsp;
              <Link href="/cookies" className="underline hover:text-red-700">{t.footer.cookiesPolicy}</Link> |&nbsp;
              <Link href="/privacy" className="underline hover:text-red-700">{t.footer.privacyPolicy}</Link>
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/canada" className="hover:text-red-700">
                  Canada eTA Home
                </Link>
              </li>
              <li>
                <Link href="/canada/apply" className="hover:text-red-700">
                  Apply for eTA
                </Link>
              </li>
              <li>
                <Link href="#eta-info" className="hover:text-red-700">
                  eTA Information
                </Link>
              </li>
              <li>
                <Link href="#benefits" className="hover:text-red-700">
                  Benefits
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/sslsecure.png"
              alt="SSL Secure"
              width={60}
              height={60}
            />
          </div>
        </div>
      </div>
    </footer>
  );
} 