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
    default: "LaidbyOma - Professional Hair Services",
    template: "%s | LaidbyOma"
  },
  description: "Premier hair booking platform. Specializing in frontal installation, braids, wig installation, and professional hair care services in your area.",
  keywords: ["hair styling", "braids", "frontal installation", "wig installation", "knotless braids", "box braids", "sew-in", "quick weave", "professional hairstylist"],
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
    title: 'LaidbyOma - Professional Hair Services',
    description: 'Premier hair booking platform. Specializing in frontal installation, braids, wig installation, and professional hair care services.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'LaidbyOma - Professional Hair & Beauty Services',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaidbyOma - Professional Hair Services',
    description: 'Premier hair booking platform. Book your appointment today!',
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
    description: 'Premier hair services specializing in braids, frontal installation, wig installation, and professional hair care.',
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
            name: 'Wig Installation & Styling',
            description: 'Professional wig installation and styling services.',
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
