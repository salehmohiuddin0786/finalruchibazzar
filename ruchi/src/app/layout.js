import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext.jsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ruchibazaar.in";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ruchi Bazaar | Fresh Food, Groceries & Quick Delivery",
    template: "%s | Ruchi Bazaar",
  },
  description:
    "Order fresh food, groceries, daily essentials, and restaurant meals online with superfast doorstep delivery from Ruchi Bazaar. Top local restaurants and unbeatable deals.",
  keywords: [
    "food delivery",
    "order food online",
    "grocery delivery",
    "quick delivery",
    "fresh vegetables online",
    "local restaurants",
    "Ruchi Bazaar",
    "fast delivery app",
    "food offers",
  ],
  authors: [{ name: "Ruchi Bazaar Team" }],
  creator: "Ruchi Bazaar",
  publisher: "Ruchi Bazaar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Ruchi Bazaar | Fresh Food, Groceries & Quick Delivery",
    description:
      "Order fresh food, groceries, and daily essentials online with lightning-fast delivery to your door.",
    url: siteUrl,
    siteName: "Ruchi Bazaar",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ruchi Bazaar - Fresh & Fast Food and Grocery Delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruchi Bazaar | Fresh Food, Groceries & Quick Delivery",
    description:
      "Order fresh food, groceries, and daily essentials delivered in minutes.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ruchi Bazaar",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: "Fresh Food, Groceries & Quick Doorstep Delivery Platform",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      availableLanguage: ["English", "Hindi"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ruchi Bazaar",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/Restaurants?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}