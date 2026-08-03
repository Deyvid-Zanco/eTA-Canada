import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { LanguageProvider } from "../lib/contexts/LanguageContext";
import Script from "next/script";

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
  title: "IMMI WORLD - Private Travel Application Assistance",
  description:
    "Independent paid assistance for travelers preparing online travel application information. IMMI WORLD is not a government website and does not issue travel authorizations.",
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
    <html lang="en" style={{ colorScheme: 'light' }}>
      <head>
        <meta name="color-scheme" content="light" />
        {/* ClickCease.com tracking */}
        <Script
          id="clickcease-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var script = document.createElement('script');
              script.async = true; 
              script.type = 'text/javascript';
              var target = 'https://www.clickcease.com/monitor/stat.js';
              script.src = target;
              var elem = document.head;
              elem.appendChild(script);
            `,
          }}
        />
        <noscript>
          <a href='https://www.clickcease.com' rel='nofollow'>
            <Image src='https://monitor.clickcease.com' alt='ClickCease' width={1} height={1}/>
          </a>
        </noscript>
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
