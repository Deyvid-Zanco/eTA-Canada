import type { Metadata } from 'next';

// Canada-specific metadata with original favicon
export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico', // Original favicon for Canada pages
  },
};

export default function CanadaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
