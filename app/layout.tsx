import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../lib/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.immicenter-online.com"),
  title: {
    default: "Canada eTA Application Assistance | IMMI WORLD",
    template: "%s | IMMI WORLD",
  },
  description:
    "Optional private review and guidance for Canada eTA application information. US$42 service fee. Not affiliated with the Government of Canada.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "IMMI WORLD",
    title: "Canada eTA Application Assistance | IMMI WORLD",
    description:
      "Independent private review and guidance for Canada eTA application information.",
    images: [{ url: "/canada-eta-hero.png", width: 1920, height: 780 }],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
