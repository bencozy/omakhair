import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oma Khair - Hair & Makeup Booking",
  description: "Book professional hair and makeup appointments with Oma Khair. Specializing in frontal installation, braids, wig making, and more.",
  keywords: "hair styling, makeup, braids, frontal installation, wig making, hair coloring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
