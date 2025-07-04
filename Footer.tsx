import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-16 py-10 text-sm" id="contact">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1 flex flex-col gap-4">
            <Image
              src="/eta-canada-immi-center-logo-1024x339.png"
              alt="Visa eTa Canada"
              width={160}
              height={40}
            />
            <p className="text-gray-600 text-xs leading-relaxed break-words">
              Disclaimer: IMMI CENTER is not affiliated with any government agency or department. Costs for consulting services DO NOT include any government solicitation, medical examination, or biometric fees. We are a private travel consultancy provider. You can apply directly for visas on the Embassy or Consulate websites. IMMI CENTER is authorized by the Ministry of Tourism through Cadastur to operate with the activity of obtaining and legalizing documents for travelers in accordance with Law 11.771/08 – Art. 27 § 4º I which can be verified at:&nbsp;
              <a href="https://cadastur.turismo.gov.br/cadastur/#!/public/qrcode/41909350000152" target="_blank" className="underline hover:text-red-700">Cadastur QR&nbsp;Code</a>.
              &nbsp;MAYARA&nbsp;MANCINI&nbsp;DE&nbsp;OLIVEIRA&nbsp;COSTA – CNPJ 41.909.350/0001-52.&nbsp;
              <Link href="/terms" className="underline hover:text-red-700">Terms of Use</Link> |&nbsp;
              <Link href="/cookies" className="underline hover:text-red-700">Cookies Policy</Link> |&nbsp;
              <Link href="/privacy" className="underline hover:text-red-700">Privacy Policy</Link>
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/apply" className="hover:text-red-700">
                  Apply Online
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