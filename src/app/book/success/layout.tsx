import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Confirmed',
  description: 'Your appointment has been successfully confirmed. Check your email for confirmation details.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

