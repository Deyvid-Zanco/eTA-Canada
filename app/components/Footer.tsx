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
              <a href="https://cadastur.turismo.gov.br/cadastur/#!/public/qrcode/43274527000117" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">{t.footer.cadasturLink}</a>.
              &nbsp;<b>{t.footer.companyInfo}</b>&nbsp;
              <Link href="/terms" className="underline hover:text-blue-700">{t.footer.termsOfUse}</Link> |&nbsp;
              <Link href="/privacy" className="underline hover:text-blue-700">{t.footer.privacyPolicy}</Link> |&nbsp;
              <Link href="/refund" className="underline hover:text-blue-700">{t.footer.refundPolicy}</Link> |&nbsp;
              <Link href="/delivery" className="underline hover:text-blue-700">{t.footer.deliveryPolicy}</Link>
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
              <a href="https://cadastur.turismo.gov.br/cadastur/#!/public/qrcode/43274527000117" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-700">{t.footer.cadasturLink}</a>.
              &nbsp;<b>{t.footer.companyInfo}</b>&nbsp;
              <Link href="/terms" className="underline hover:text-red-700">{t.footer.termsOfUse}</Link> |&nbsp;
              <Link href="/privacy" className="underline hover:text-red-700">{t.footer.privacyPolicy}</Link> |&nbsp;
              <Link href="/refund" className="underline hover:text-red-700">{t.footer.refundPolicy}</Link> |&nbsp;
              <Link href="/delivery" className="underline hover:text-red-700">{t.footer.deliveryPolicy}</Link>
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
              Disclaimer: Immi Center is not affiliated with any government agency or department. Costs for consulting services do not include any government solicitation, medical examination, or biometric fees. We are a private travel consultancy provider. You can apply directly for visas on the Embassy or Consulate websites. Immi Center is authorized by the Ministry of Tourism through Cadastur to operate with the activity of obtaining and legalizing documents for travelers in accordance with Law 11.771/08 – Art. 27 § 4o I which can be verified at: <a href="https://cadastur.turismo.gov.br/cadastur/#!/public/qrcode/43274527000117" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">Cadastur QR Code</a>. <b>Heliza Giovana Conrado de Andrade Chacha – CNPJ 43.274.527/0001-17.</b>&nbsp;
              <Link href="/terms" className="underline hover:text-blue-700">Terms and Conditions</Link> |&nbsp;
              <Link href="/privacy" className="underline hover:text-blue-700">Privacy Policy</Link> |&nbsp;
              <Link href="/refund" className="underline hover:text-blue-700">Refund Policy</Link> |&nbsp;
              <Link href="/delivery" className="underline hover:text-blue-700">Delivery Policy</Link>
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
              <a href="https://cadastur.turismo.gov.br/cadastur/#!/public/qrcode/43274527000117" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-700">{t.footer.cadasturLink}</a>.
              &nbsp;<b>{t.footer.companyInfo}</b>&nbsp;
              <Link href="/terms" className="underline hover:text-red-700">{t.footer.termsOfUse}</Link> |&nbsp;
              <Link href="/privacy" className="underline hover:text-red-700">{t.footer.privacyPolicy}</Link> |&nbsp;
              <Link href="/refund" className="underline hover:text-red-700">{t.footer.refundPolicy}</Link> |&nbsp;
              <Link href="/delivery" className="underline hover:text-red-700">{t.footer.deliveryPolicy}</Link>
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