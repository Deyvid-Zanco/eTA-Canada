import type { Metadata } from 'next';
import { CanadaApplyClientWrapper } from './CanadaApplyClientWrapper';

// Canada-specific favicon
export const metadata: Metadata = {
  title: 'Private Canada eTA Application Assistance',
  description: 'Secure information form for IMMI WORLD optional private Canada eTA review and guidance.',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CanadaApplyClientWrapper>{children}</CanadaApplyClientWrapper>;
}
