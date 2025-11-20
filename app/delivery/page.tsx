import { GeneralHeader } from "../components/Header";
import { GeneralFooter } from "../components/Footer";

export default function DeliveryPage() {
  return (
    <>
      <GeneralHeader />
      <main className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Delivery Policy</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">
            Complete all the required fields on our application page and pay the service fee (42 USD for Canada eTA, 57 USD for Philippines eTravel). This includes our help and assistance with the application process.
          </p>

          <p className="mb-4">
            Once our same-day Processing Service is completed, which includes weekends and holidays, you will receive an email with the result of our Service. During the review of your file, you are not considered to hold a valid travel authorization. As such, you should not plan or undertake any travel until you are advised otherwise. You will be advised within 72 hours of next steps regarding your application. In some cases you might need to upload extra documentation, if required and support is needed, please contact us thru our 24/7 free support service line.
          </p>

          <p className="mb-4">
            We strongly recommend you to add our email address to your white list to ensure that our email is not rejected due to an overfilled inbox.
          </p>

          <p className="mb-4">
            If you have any questions regarding our delivery policy, please contact us by email (immiworldcenter@gmail.com). We will respond usually within an hour.
          </p>

          <p className="mb-4">
            Remember that in case your travel authorization result is not approved by any reason you are eligible for a full refund, you are invited to request it by email (immiworldcenter@gmail.com)
          </p>
        </div>
      </main>
      <GeneralFooter />
    </>
  );
}

