"use client";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
        <Link href="/">
          <Image
            src="/eta-canada-immi-center-logo-1024x339.png"
            alt="Visa eTa Canada"
            width={160}
            height={40}
            priority
          />
        </Link>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/" className="hover:text-red-700">
            Canada eTA Application
          </Link>
          <Link href="#eta-info" className="hover:text-red-700">
            Canada eTA Information
          </Link>
          <Link href="#contact" className="hover:text-red-700">
            Contact us
          </Link>
        </nav>
        <Link
          href="/apply"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-4 py-2 rounded-md"
        >
          Apply Online
        </Link>
      </div>
      {/* Mobile nav */}
      <nav className="md:hidden bg-gray-50 border-t">
        <ul className="flex flex-col divide-y">
          <li>
            <Link href="/" className="block px-4 py-3">
              Canada eTA Application
            </Link>
          </li>
          <li>
            <Link href="#eta-info" className="block px-4 py-3">
              Canada eTA Information
            </Link>
          </li>
          <li>
            <Link href="#contact" className="block px-4 py-3">
              Contact us
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
} 