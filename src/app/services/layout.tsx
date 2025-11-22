import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore our comprehensive hair services including braids, knotless braids, box braids, frontal installation, wig installation, sew-ins, and quick weaves. Expert craftsmanship with premium products.',
  keywords: [
    'hair services',
    'braiding services',
    'knotless braids',
    'box braids',
    'cornrows',
    'frontal installation',
    'wig installation',
    'wig styling',
    'sew-in',
    'quick weave',
    'professional hairstylist',
    'hair salon services',
    'protective hairstyles',
    'natural hair care'
  ],
  openGraph: {
    title: 'Our Services | LaidbyOma',
    description: 'Professional hair services including braids, frontal installation, wig installation, and more. Book your appointment today!',
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

