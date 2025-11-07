import type { Metadata } from 'next';
import { ApplyClientWrapper } from './ApplyClientWrapper';

// Philippines favicon for apply pages
export const metadata: Metadata = {
  icons: {
    icon: '/favicons/phillipines.ico', // Philippines favicon
  },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApplyClientWrapper>{children}</ApplyClientWrapper>;
} 