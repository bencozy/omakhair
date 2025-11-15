import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://laidbyoma.com'),
  title: {
    default: "LaidbyOma - Professional Hair & Beauty Services",
    template: "%s | LaidbyOma"
  },
  description: "Premier hair and beauty booking platform. Specializing in frontal installation, braids, wig making, and professional hair care services in your area.",
  keywords: ["hair styling", "makeup artist", "braids", "frontal installation", "wig making", "hair coloring", "knotless braids", "box braids", "beauty services", "professional hairstylist"],
  authors: [{ name: "LaidbyOma" }],
  creator: "LaidbyOma",
  publisher: "LaidbyOma",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'LaidbyOma',
    title: 'LaidbyOma - Professional Hair & Beauty Services',
    description: 'Premier hair and beauty booking platform. Specializing in frontal installation, braids, wig making, and professional hair care services.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'LaidbyOma - Professional Hair & Beauty Services',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaidbyOma - Professional Hair & Beauty Services',
    description: 'Premier hair and beauty booking platform. Book your appointment today!',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: 'LaidbyOma',
    description: 'Premier hair and beauty services specializing in braids, frontal installation, wig making, and professional hair care.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://laidbyoma.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://laidbyoma.com'}/laidbyoma.png`,
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://laidbyoma.com'}/laidbyoma.png`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    areaServed: {
      '@type': 'City',
      name: 'United States',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Hair & Beauty Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Braids & Knotless Braids',
            description: 'Professional braiding services including box braids, knotless braids, and more.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Frontal Installation',
            description: 'Expert frontal installation for a natural, seamless look.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Wig Making & Styling',
            description: 'Custom wig creation and professional wig styling services.',
          },
        },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
