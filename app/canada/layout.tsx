import type { Metadata } from 'next';

// Canada-specific metadata with original favicon
export const metadata: Metadata = {
  title: 'Private Canada eTA Application Assistance | IMMI WORLD',
  description: 'Optional paid assistance to review and organize your Canada eTA application information. IMMI WORLD is a private consultancy, not a government website.',
  icons: {
    icon: '/favicon.ico',
  },
  alternates: { canonical: '/canada' },
  openGraph: {
    title: 'Private Canada eTA Application Assistance | IMMI WORLD',
    description: 'Independent paid application assistance. We do not issue eTAs and cannot guarantee a decision.',
    url: 'https://www.immi-world.com/canada',
    siteName: 'IMMI WORLD',
    images: ['/hero.png'],
    type: 'website',
  },
};

export default function CanadaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
