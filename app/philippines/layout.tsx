import type { Metadata } from 'next';

// This metadata will apply to all pages inside the /forms folder
export const metadata: Metadata = {
  icons: {
    icon: '/favicons/phillipines.ico', // Path to your forms favicon
  },
};

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}