"use client";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../lib/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { useState } from "react";

// Philippines-specific Header
export function PhilippinesHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto flex justify-center items-center px-4 md:px-8">
          <div className="flex items-center text-sm">
            <span className="text-white text-center w-full">
              🇵🇭 Philippines eTravel Visa - Fast, Secure, Reliable Processing
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-transparent">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
          {/* Logo */}
          <Link href="/philippines" className="flex items-center space-x-3">
            <Image
              src="/logo-phillipines.png"
              alt="IMMI CENTER Philippines"
              width={250}
              height={80}
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
            <Link href="/philippines" className="text-gray-800 hover:text-blue-700">
              Home
            </Link>

            <Link href="/philippines/apply" className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">
              Apply
            </Link>

            <Link href="#faq" className="text-gray-800 hover:text-blue-700">
              FAQ
            </Link>

            <Link href="mailto:info@immi-center.com" className="text-gray-800 hover:text-blue-700">
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <nav className="container mx-auto py-4 px-4 space-y-4">
              <Link
                href="/philippines"
                className="block text-gray-800 hover:text-blue-700 text-center py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/philippines/apply"
                className="block bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Apply
              </Link>
              <Link
                href="#faq"
                className="block text-gray-800 hover:text-blue-700 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="mailto:info@immi-center.com"
                className="block text-gray-800 hover:text-blue-700 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// General Header for main landing page - Just logo
export function GeneralHeader() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-start items-center py-4 px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo-default.png"
            alt="IMMI CENTER"
            width={250}
            height={80}
            priority
          />
        </Link>
      </div>
    </header>
  );
}

// Canada-specific Header
export function CanadaHeader() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white py-2">
        <div className="container mx-auto flex justify-center items-center px-4 md:px-8">
          <div className="flex items-center text-sm">
            <span className="text-white text-center w-full">
              {t.header.topBarMessage}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-transparent">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
          {/* Logo */}
          <Link href="/canada" className="flex items-center space-x-3">
            <Image
              src="/eta-canada-immi-center-logo-1024x339.png"
              alt="Visa eTa Canada"
              width={250}
              height={80}
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
            <Link href="/canada" className="text-gray-800 hover:text-red-700">
              Home
            </Link>

            <Link href="/canada/apply" className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white">
              Apply
            </Link>

            <Link href="#contact" className="text-gray-800 hover:text-red-700">
              Contact
            </Link>
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-800 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <nav className="container mx-auto py-4 px-4 space-y-4">
              <Link
                href="/canada"
                className="block text-gray-800 hover:text-red-700 text-center py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                href="/canada/apply"
                className="block bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Apply
              </Link>

              <div className="pt-2 border-t border-gray-200">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 

export default CanadaHeader;
