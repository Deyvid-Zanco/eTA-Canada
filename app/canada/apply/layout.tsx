import type { Metadata } from 'next';
import { CanadaApplyClientWrapper } from './CanadaApplyClientWrapper';

// Canada-specific favicon
export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico', // Original favicon for Canada apply
  },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CanadaApplyClientWrapper>{children}</CanadaApplyClientWrapper>;
} 