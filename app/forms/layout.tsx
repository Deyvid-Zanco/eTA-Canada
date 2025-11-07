import type { Metadata } from 'next';
import { FormsClientWrapper } from './FormsClientWrapper';

// Philippines favicon for all forms
export const metadata: Metadata = {
  icons: {
    icon: '/favicons/phillipines.ico', // Philippines favicon for forms (note: filename uses 'phillipines')
  },
};

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormsClientWrapper>{children}</FormsClientWrapper>;
}