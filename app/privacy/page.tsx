import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">
          This page is a placeholder for IMMI CENTER&apos;s Privacy Policy. Once the
          final text is ready, replace this placeholder content.
        </p>
        <p className="text-gray-600">
          [Insert details about data collection, processing, storage, and user
          rights in accordance with applicable regulations.]
        </p>
      </main>
      <Footer />
    </>
  );
} 