import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
        <p className="mb-4">
          This page is a placeholder for IMMI CENTER&apos;s full Terms of Use. Please
          provide the finalized legal copy and we will replace this text.
        </p>
        <p className="text-gray-600">
          [Insert detailed terms outlining the scope of services, user
          responsibilities, liability limitations, and governing law.]
        </p>
      </main>
      <Footer />
    </>
  );
} 