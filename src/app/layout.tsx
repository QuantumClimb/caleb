import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../../components/layout/header";
import { Footer } from "../../components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CALEB - Gaming Marketplace",
  description: "Your ultimate gaming marketplace for digital products, game keys, gift cards, and in-game currency. Find the best deals on PC, PlayStation, Xbox, and Nintendo games.",
  keywords: ["gaming", "marketplace", "game keys", "gift cards", "digital games", "steam", "playstation", "xbox", "nintendo"],
  authors: [{ name: "CALEB Team" }],
  creator: "CALEB",
  publisher: "CALEB",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://caleb-marketplace.vercel.app'),
  openGraph: {
    title: "CALEB - Gaming Marketplace",
    description: "Your ultimate gaming marketplace for digital products, game keys, and gift cards.",
    url: 'https://caleb-marketplace.vercel.app',
    siteName: 'CALEB',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CALEB Gaming Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CALEB - Gaming Marketplace",
    description: "Your ultimate gaming marketplace for digital products, game keys, and gift cards.",
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
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
