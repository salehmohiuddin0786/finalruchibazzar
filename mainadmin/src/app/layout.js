import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AdminOrderNotifications from "./components/AdminOrderNotifications";

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
    default: "Superadmin Control Center | Ruchi Bazaar",
    template: "%s | Ruchi Bazaar Superadmin",
  },
  description: "Enterprise management and operational control center for Ruchi Bazaar executives and system administrators.",
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
        <AdminOrderNotifications />
        {children}
      </body>
    </html>
  );
}
