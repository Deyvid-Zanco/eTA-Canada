import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "IMMI CENTER - eTA & Visa Services | Belgium",
  description:
    "Complete your visa applications online for over 135 destinations. Electronic Travel Authorization (eTA) for Canada, Philippines and more. Quick and easy visa processing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
            <img src='https://monitor.clickcease.com' alt='ClickCease'/>
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
