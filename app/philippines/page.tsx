"use client";
import Head from "next/head";
import Link from "next/link";
import { PhilippinesHeader } from "../components/Header";
import Footer from "../components/Footer";

export default function PhilippinesLandingPage() {
  return (
    <>
      <Head>
        <title>Philippines eTravel Visa - Electronic Travel Authorization</title>
        <meta
          name="description"
          content="Apply for Philippines eTravel Visa online. Get your Electronic Travel Authorization (eTA) for visiting the Philippines. Fast, secure, and reliable visa processing."
        />
        <meta property="og:title" content="Philippines eTravel Visa" />
        <meta
          property="og:description"
          content="Apply for Philippines eTravel Visa online. Get your Electronic Travel Authorization (eTA) for visiting the Philippines."
        />
        <meta property="og:url" content="https://www.immi-center.com/philippines" />
        <meta property="og:site_name" content="Philippines eTravel Visa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PhilippinesHeader />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="m-philippines-hero px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg">
              Philippines eTravel Visa
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 max-w-4xl mx-auto drop-shadow-md">
              Apply for your Electronic Travel Authorization (eTA) to visit the beautiful Philippines.
              Simple online application process with fast approval.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-gray-900">
                <div className="text-3xl md:text-4xl font-bold text-gray-900">30</div>
                <div className="text-sm md:text-base text-gray-700">Days Validity</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-gray-900">
                <div className="text-3xl md:text-4xl font-bold text-gray-900">7,107</div>
                <div className="text-sm md:text-base text-gray-700">Islands to Explore</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-gray-900">
                <div className="text-3xl md:text-4xl font-bold text-gray-900">€25</div>
                <div className="text-sm md:text-base text-gray-700">Starting Price</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/philippines/apply"
                className="bg-yellow-500 hover:bg-yellow-600 text-black py-4 px-8 rounded-lg text-lg md:text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Apply for eTravel Visa
              </Link>
              <a
                href="tel:+3227930456"
                className="bg-white bg-opacity-90 backdrop-blur-sm border-2 border-white text-gray-900 hover:bg-white hover:text-blue-900 py-4 px-8 rounded-lg text-lg md:text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Call for Assistance
              </a>
            </div>

          </div>
        </section>

        {/* Philippines Info Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Discover the Philippines
                </h2>
                <p className="text-lg mb-6">
                  The Philippines offers stunning beaches, rich culture, vibrant cities, and warm hospitality.
                  Whether you&apos;re planning a relaxing beach vacation, exploring historic sites, or doing business,
                  getting your eTravel Visa is the first step to your Philippine adventure.
                </p>
                <Link
                  href="/philippines/apply"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md text-lg font-semibold inline-block"
                >
                  Start Your Application
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">eTravel Visa Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Apply online from anywhere
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Fast processing (usually 24-48 hours)
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Valid for 30 days from arrival
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Multiple entry capability
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Secure and confidential processing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Simple 3-Step Application Process
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Fill Application Form</h3>
                <p className="text-gray-600">
                  Complete our secure online application form with your personal and travel information.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Make Payment</h3>
                <p className="text-gray-600">
                  Secure online payment processing. Your application will be processed upon payment confirmation.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Receive Approval</h3>
                <p className="text-gray-600">
                  Get your eTravel Visa approval via email. Present it upon arrival in the Philippines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Popular Philippine Destinations
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🏖️</div>
                <h3 className="font-semibold mb-2">Boracay</h3>
                <p className="text-sm text-gray-600">World-famous white sand beaches</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🏛️</div>
                <h3 className="font-semibold mb-2">Intramuros</h3>
                <p className="text-sm text-gray-600">Historic walled city in Manila</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🌋</div>
                <h3 className="font-semibold mb-2">Palawan</h3>
                <p className="text-sm text-gray-600">Stunning limestone cliffs and lagoons</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🏰</div>
                <h3 className="font-semibold mb-2">Cebu</h3>
                <p className="text-sm text-gray-600">Rich history and vibrant culture</p>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Application Requirements
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Required Documents</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Valid passport (with at least 6 months validity)
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Recent passport-sized photo
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Flight itinerary or travel plans
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Hotel booking confirmation
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Eligibility</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Citizens of eligible countries
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Purpose: Tourism, business, transit
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Stay up to 30 days
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Valid for multiple entries
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Visit the Philippines?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start your Philippines eTravel Visa application today. Fast, secure, and reliable processing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/philippines/apply"
                className="bg-yellow-500 hover:bg-yellow-600 text-black py-4 px-12 rounded-md text-xl font-semibold transition-colors"
              >
                Apply Now - From €25
              </Link>
              <Link
                href="/"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 py-4 px-12 rounded-md text-xl font-semibold transition-colors"
              >
                Other Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}