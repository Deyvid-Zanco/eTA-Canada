import { GeneralHeader } from "../components/Header";
import { GeneralFooter } from "../components/Footer";

export default function TermsPage() {
  return (
    <>
      <GeneralHeader />
      <main className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mt-8 mb-4">LEGAL NOTICE</h2>
          <p className="mb-4">
            At Immi World®, we are committed to building a relationship with our clients based on transparency and trust. It is important that you understand your legal rights and obligations when using our website and services. By accessing or using this website, you acknowledge and agree to the following terms and conditions.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-4">Use of Services</h3>
          <p className="mb-4">
            Immi World® operates as an online application service provider, assisting foreign nationals in completing and submitting Travel Authorization applications required to visit Canada and other destinations.
          </p>
          <p className="mb-4">
            Our team facilitates the process of obtaining your Travel Authorization and delivers the approved authorization to you.
          </p>
          <p className="mb-4">
            By registering, visiting, or using our services through immi-world.com, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
          </p>
        </div>
      </main>
      <GeneralFooter />
    </>
  );
} 