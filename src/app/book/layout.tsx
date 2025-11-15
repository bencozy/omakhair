import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Appointment',
  description: 'Book your hair and beauty appointment online. Choose from our wide range of services including braids, frontal installation, wig making, and more. Easy online booking with instant confirmation.',
  keywords: ['book appointment', 'hair appointment', 'beauty booking', 'online scheduling', 'hair services booking'],
  openGraph: {
    title: 'Book Appointment | LaidbyOma',
    description: 'Book your hair and beauty appointment online. Easy scheduling with instant confirmation.',
    url: '/book',
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

