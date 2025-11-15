import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore our comprehensive hair and beauty services including braids, knotless braids, box braids, frontal installation, wig making, hair coloring, and professional makeup. Expert craftsmanship with premium products.',
  keywords: [
    'hair services',
    'braiding services',
    'knotless braids',
    'box braids',
    'cornrows',
    'frontal installation',
    'wig making',
    'wig styling',
    'hair coloring',
    'makeup services',
    'professional hairstylist',
    'hair salon services',
    'protective hairstyles',
    'natural hair care'
  ],
  openGraph: {
    title: 'Our Services | LaidbyOma',
    description: 'Professional hair and beauty services including braids, frontal installation, wig making, and more. Book your appointment today!',
    url: '/services',
    type: 'website',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

