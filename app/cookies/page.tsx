import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Cookies Policy</h1>
        <p className="mb-4">
          This page is a placeholder for IMMI CENTER's Cookies Policy. Provide
          your official policy text and we will update this section.
        </p>
        <p className="text-gray-600">
          [Insert information about types of cookies used, purpose, and how
          users can manage cookie preferences.]
        </p>
      </main>
      <Footer />
    </>
  );
} 