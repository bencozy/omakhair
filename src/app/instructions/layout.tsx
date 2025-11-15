import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Instructions & Guidelines',
  description: 'Important instructions and guidelines for your LaidbyOma appointment. Learn about our policies, preparation tips, and what to expect during your visit.',
  keywords: ['appointment instructions', 'booking guidelines', 'hair appointment preparation', 'cancellation policy'],
  openGraph: {
    title: 'Booking Instructions | LaidbyOma',
    description: 'Important instructions and guidelines for your appointment. Learn about our policies and preparation tips.',
    url: '/instructions',
  },
};

export default function InstructionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

