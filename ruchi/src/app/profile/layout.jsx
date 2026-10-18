export const metadata = {
  title: "My Profile & Account Settings",
  description: "Manage your personal profile, delivery addresses, phone number, and preferences on Ruchi Bazaar.",
  openGraph: {
    title: "My Profile | Ruchi Bazaar",
    description: "Manage your personal profile, delivery addresses, and preferences on Ruchi Bazaar.",
    url: "https://ruchibazaar.in/profile",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({ children }) {
  return children;
}
