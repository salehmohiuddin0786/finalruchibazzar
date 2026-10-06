import { redirect } from "next/navigation";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = params?.q || params?.search || "";
  redirect(`/Restaurants${q ? `?search=${encodeURIComponent(q)}` : ""}`);
}
