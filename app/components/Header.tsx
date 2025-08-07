"use client";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../lib/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { useState } from "react";

export default function Header() {
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
          <Link href="/" className="flex items-center space-x-3">
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
            <Link href="/" className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white">
              {t.header.home}
            </Link>
            <Link href="/apply" className="text-gray-800 hover:text-red-700">
              {t.header.applyEta}
            </Link>
            <Link href="#steps" className="text-gray-800 hover:text-red-700">
              {t.header.processing}
            </Link>
            <Link href="#faqs" className="text-gray-800 hover:text-red-700">
              {t.header.faqs}
            </Link>
            <a href="mailto:immigration-support@immi-center.com" className="text-gray-800 hover:text-red-700">
              {t.header.contactUs}
            </a>
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
                href="/" 
                className="block bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.header.home}
              </Link>
              <Link 
                href="/apply" 
                className="block text-gray-800 hover:text-red-700 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.header.applyEta}
              </Link>
              <Link 
                href="#steps" 
                className="block text-gray-800 hover:text-red-700 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.header.processing}
              </Link>
              <Link 
                href="#faqs" 
                className="block text-gray-800 hover:text-red-700 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.header.faqs}
              </Link>
              <a 
                href="mailto:immigration-support@immi-center.com" 
                className="block text-gray-800 hover:text-red-700 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.header.contactUs}
              </a>
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