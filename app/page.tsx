"use client";
import Head from "next/head";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CountrySearchGrid from "./components/CountrySearchGrid";
import { useLanguage } from "../lib/contexts/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <>
      <Head>
        <title>Canada eTA </title>
        <meta
          name="description"
          content="Complete the eTA Canada application and obtain your Electronic Travel Authorization to visit Canada (ETA). All Visa-exempt foreign nationals must request their Canadian eTA."
        />
        <meta property="og:title" content="Canada eTA" />
        <meta
          property="og:description"
          content="Complete the eTA Canada application and obtain your Electronic Travel Authorization to visit Canada (ETA). All Visa-exempt foreign nationals must request their Canadian eTA."
        />
        <meta
          property="og:image"
          content="/eta-canada-immi-center-logo-1024x339.png"
        />
        <meta property="og:url" content="https://www.immi-center.com" />
        <meta property="og:site_name" content="Visa eTa Canada" />
        <meta name="robots" content="noindex,nofollow" />
        <link
          rel="shortcut icon"
          href="/static/img/canada/canadaetavisa/favicon.ico"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="m-jumbotron-image6 flex flex-col items-center justify-center text-center gap-6 px-4">
          <h1 className="text-3xl md:text-5xl font-bold max-w-3xl">
            {t.hero.title}
          </h1>
          <p className="max-w-2xl">
            {t.hero.subtitle}
          </p>
          <Link
            href="/apply"
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-md text-lg font-semibold"
          >
            {t.hero.applyNow}
          </Link>
        </section>

        {/* Steps Section */}
        <section className="m-steps container mx-auto py-16 px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <span className="step-number">1</span>
              <h3 className="font-semibold mb-2">{t.steps.step1.title}</h3>
              <p>{t.steps.step1.description}</p>
            </div>
            <div>
              <span className="step-number">2</span>
              <h3 className="font-semibold mb-2">{t.steps.step2.title}</h3>
              <p>{t.steps.step2.description}</p>
            </div>
            <div>
              <span className="step-number">3</span>
              <h3 className="font-semibold mb-2">{t.steps.step3.title}</h3>
              <p>{t.steps.step3.description}</p>
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section id="eta-info" className="container mx-auto py-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t.info.title}
          </h2>
          <h3 className="text-xl font-semibold mb-4">{t.info.subtitle}</h3>
          <p className="mb-6 max-w-3xl">
            {t.info.description}
          </p>
          <Link
            href="/apply"
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-md"
          >
            {t.info.applyButton}
          </Link>
        </section>

        {/* Country List Section */}
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t.countryList.title}
          </h2>
          <CountrySearchGrid />
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="container mx-auto py-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{t.benefits.title}</h2>
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-1/2 text-left p-3">{t.benefits.service}</th>
                <th className="p-3">{t.benefits.ourService}</th>
                <th className="p-3">{t.benefits.government}</th>
              </tr>
            </thead>
            <tbody>
              {[
                [t.benefits.onlineApplication, true, true],
                [t.benefits.applicationRevision, true, false],
                [t.benefits.emailSupport, true, false],
              ].map(([label, ours, gov], idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="text-left p-3 border-t border-gray-200">
                    {label as string}
                  </td>
                  <td className="p-3 border-t border-gray-200">
                    {ours ? (
                      <span className="text-green-600 font-bold">✔</span>
                    ) : (
                      <span className="text-red-600 font-bold">✖</span>
                    )}
                  </td>
                  <td className="p-3 border-t border-gray-200">
                    {gov ? (
                      <span className="text-green-600 font-bold">✔</span>
                    ) : (
                      <span className="text-red-600 font-bold">✖</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Final CTA */}
        <section className="text-center py-12 bg-gray-50">
          <Link
            href="/apply"
            className="bg-red-600 hover:bg-red-700 text-white py-4 px-12 rounded-md text-xl font-semibold"
          >
            {t.finalCta.applyForEta}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
