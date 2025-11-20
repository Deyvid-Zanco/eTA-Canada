import { GeneralHeader } from "../components/Header";
import { GeneralFooter } from "../components/Footer";

export default function RefundPage() {
  return (
    <>
      <GeneralHeader />
      <main className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">
            A full refund will be automatically processed to all users who have made their application through this website in case of application denial by the Government.
          </p>

          <p className="mb-4">
            Once you have submitted your application with us, it is assumed and agreed that we will begin the submission process within the timeframe indicated during your application. If you decide to request a refund after your application has been submitted, you may be deemed to accept an application service cancelation fee (35USD), and will only be accepted if the application has not been submitted to the relevant Government authority. However, refunds due to personal changes or simple cancellation of travel may also be rejected, so please understand and apply as indicated on our website. Refunds that are Reimbursements other than rebates approved by the relevant government will be determined within 72 hours of our legal team&apos;s assessment.
          </p>

          <p className="mb-4">
            All transactions are conducted in United States dollars. Your refund will be issued in US dollars and posted within three working days of your written request for withdrawal from your contract. Once you have received the payment, your bank or credit card company may convert it to your local currency. You will receive the same USD amount as charged in return.
          </p>

          <p className="mb-4">
            If you wish to request a refund, email us at immiworldcenter@gmail.com indicating the following:
          </p>

          <ul className="list-disc pl-6 mb-4">
            <li>Your reason for the request.</li>
            <li>Your full names (as appears in your passport).</li>
            <li>Passport number.</li>
            <li>The email used to make the registration on this website.</li>
          </ul>

          <p className="mb-4">
            For multiple requests, please indicate all names and Passport number. All refund requests will be evaluated within 72 hours.
          </p>
        </div>
      </main>
      <GeneralFooter />
    </>
  );
}

