"use client";
import Head from "next/head";
import Link from "next/link";
import { GeneralHeader } from "./components/Header";
import { GeneralFooter } from "./components/Footer";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>IMMI CENTER - eTA & Visa Services | Canada, Philipines</title>
        <meta
          name="description"
          content="Complete your visa applications online for over 135 destinations. Electronic Travel Authorization (eTA) for Canada, Philippines and more. Quick and easy visa processing."
        />
        <meta property="og:title" content="IMMI CENTER - eTA & Visa Services" />
        <meta
          property="og:description"
          content="eTA applications quick and easy. Visa services for individuals, SME, corporations. Belgian residents can obtain visas for 135+ destinations online."
        />
        <meta property="og:url" content="https://www.immi-center.com" />
        <meta property="og:site_name" content="IMMI CENTER" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GeneralHeader />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="m-landing-hero px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  your visa<br />
                  <span className="text-yellow-400">quick and easy</span>
                </h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto md:mx-0">
                  Complete your Electronic Travel Authorization (eTA) applications online for multiple destinations worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    href="#services"
                    className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-8 rounded-md text-lg font-semibold transition-colors"
                  >
                    ask it online
                  </Link>
                  <a
                    href="tel:+3227930456"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 py-3 px-8 rounded-md text-lg font-semibold transition-colors"
                  >
                    need help? save time!
                  </a>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* eTA Services */}
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow text-center">
                <h3 className="text-2xl font-bold mb-4">eTA applications</h3>
                <p className="text-lg mb-6">quick and easy</p>
                <Link
                  href="#countries"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md font-semibold inline-block transition-colors"
                >
                  ask it online
                </Link>
              </div>

              {/* Legalization */}
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow text-center">
                <h3 className="text-2xl font-bold mb-4">legalization</h3>
                <p className="text-lg mb-6">quick and easy</p>
                <Link
                  href="/services"
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-md font-semibold inline-block transition-colors"
                >
                  ask it online
                </Link>
              </div>

              {/* Support */}
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow text-center">
                <h3 className="text-2xl font-bold mb-4">need help?</h3>
                <p className="text-lg mb-6">save time!</p>
                
              </div>
            </div>

            {/* Service Description */}
            <div className="mt-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Visa Services for Everyone
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                eTA desk for individuals, SME, corporations, non-governmental organizations and everyone.
                Privileged relationships with embassies and foreign affairs ministries.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">🇨🇦</div>
                  <p className="font-semibold">Canada eTA</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🇵🇭</div>
                  <p className="font-semibold">Philippines eTravel</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📄</div>
                  <p className="font-semibold">Document Legalization</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🌍</div>
                  <p className="font-semibold">135+ Countries</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Pickup and Delivery */}
              <div className="text-center">
                <div className="bg-blue-50 rounded-lg p-8">
                  <h3 className="text-2xl font-bold mb-4">Pickup and Delivery</h3>
                  <p className="text-gray-600 mb-4">
                    Having no time to drop the documentation at our office? We offer pickup and delivery services at your premises, home, office, or any convenient location.
                  </p>
                  <div className="text-4xl">🚚</div>
                </div>
              </div>

              {/* Exceptional Support */}
              <div className="text-center">
                <div className="bg-green-50 rounded-lg p-8">
                  <h3 className="text-2xl font-bold mb-4">Exceptional Support</h3>
                  <p className="text-gray-600 mb-4">
                    We&apos;re committed to all our customers to deliver the best services for visas. Have any question? You can call us, email us, or fill in our online request form.
                  </p>
                  <div className="text-4xl">🎯</div>
                </div>
              </div>

              {/* Fast Processing */}
              <div className="text-center">
                <div className="bg-purple-50 rounded-lg p-8">
                  <h3 className="text-2xl font-bold mb-4">Fast Processing</h3>
                  <p className="text-gray-600 mb-4">
                    Quick turnaround times with efficient processing to get your Electronic Travel Authorization approved as soon as possible.
                  </p>
                  <div className="text-4xl">⚡</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Countries Section */}
        <section id="countries" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Over 135 Countries Served
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Belgian residents can obtain their visas online for more than 135 destinations. We support you through all requirements and administration.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="bg-white px-4 py-2 rounded-full shadow">🇨🇦 Canada</span>
              <span className="bg-white px-4 py-2 rounded-full shadow">🇵🇭 Philippines</span>
              <span className="bg-white px-4 py-2 rounded-full shadow">🇺🇸 USA</span>
              <span className="bg-white px-4 py-2 rounded-full shadow">🇬🇧 UK</span>
              <span className="bg-white px-4 py-2 rounded-full shadow">🇪🇺 Schengen</span>
              <span className="bg-white px-4 py-2 rounded-full shadow">🇦🇺 Australia</span>
              <span className="bg-white px-4 py-2 rounded-full shadow">🇳🇿 New Zealand</span>
              <span className="bg-white px-4 py-2 rounded-full shadow">🇯🇵 Japan</span>
            </div>
            <Link
              href="#services"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md text-lg font-semibold inline-block transition-colors"
            >
              Apply for eTA Online
            </Link>
          </div>
        </section>

      

        
      </main>

      <GeneralFooter />
    </>
  );
}