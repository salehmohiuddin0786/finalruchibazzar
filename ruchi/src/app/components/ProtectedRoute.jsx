"use client";

import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {

  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!isAuthenticated) return null;

  return children;
}