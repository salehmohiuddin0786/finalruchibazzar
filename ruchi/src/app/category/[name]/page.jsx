import { redirect } from "next/navigation";

export default async function CategoryPage({ params }) {
  const { name } = await params;
  redirect(`/Restaurants?category=${encodeURIComponent(name || "")}`);
}
