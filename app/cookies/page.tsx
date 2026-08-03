import { GeneralHeader } from "../components/Header";
import { GeneralFooter } from "../components/Footer";

export default function CookiesPage() {
  return (
    <>
      <GeneralHeader />
      <main className="mx-auto max-w-4xl px-5 py-14 text-slate-700">
        <p className="text-sm font-bold uppercase tracking-widest text-[#cf2431]">Privacy information</p>
        <h1 className="mt-3 text-4xl font-bold text-[#071b34]">Cookie Policy</h1>
        <div className="mt-8 space-y-8 leading-7">
          <p>This website uses browser storage and third-party technologies needed to operate forms, remember language preferences, prevent abuse and measure advertising performance.</p>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">Technologies we use</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li><strong>Essential storage:</strong> keeps language and form-session preferences needed for the requested experience.</li>
              <li><strong>Security:</strong> Google reCAPTCHA helps identify automated submissions and abuse.</li>
              <li><strong>Advertising measurement:</strong> Google Ads tags may measure completed actions and campaign performance.</li>
              <li><strong>Fraud and click monitoring:</strong> ClickCease technology may help identify invalid advertising traffic.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">Managing cookies</h2>
            <p className="mt-3">You can restrict or delete cookies through your browser settings. Blocking essential storage may prevent parts of the form from working correctly.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#071b34]">Contact</h2>
            <p className="mt-3">Questions about tracking or privacy can be sent to <a className="font-semibold text-blue-800 underline" href="mailto:immiworldcenter@gmail.com">immiworldcenter@gmail.com</a>.</p>
          </section>
        </div>
      </main>
      <GeneralFooter />
    </>
  );
}
