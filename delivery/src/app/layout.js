import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DeliveryAssignmentPopup from "./components/DeliveryAssignmentPopup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Rider Fleet App | Ruchi Bazaar Delivery",
    template: "%s | Ruchi Bazaar Delivery",
  },
  description: "Rider companion application for delivery partners of Ruchi Bazaar. Live order tracking, dispatch, and payouts.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <DeliveryAssignmentPopup />
      </body>
    </html>
  );
}
