"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { MainAdminAuthPage } from "../components/MainAdminAuthPage";
import { getStoredMainAdmin, publicApiRequest, saveMainAdminSession } from "../lib/api";

export default function MainAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getStoredMainAdmin()) router.replace("/SuperDashboard");
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    try {
      setError("");
      setLoading(true);
      const data = await publicApiRequest("/auth/mainadmin/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      saveMainAdminSession(data);
      router.replace("/SuperDashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainAdminAuthPage
      title="Main Admin Login"
      subtitle="Sign in with an admin account to access platform controls."
      footerText="Need to create the first admin?"
      footerHref="/Signup"
      footerLabel="Sign up"
    >
      {error && (
        <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <span className="relative mt-1 block">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-500"
              placeholder="admin@ruchibazaar.com"
              required
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <span className="relative mt-1 block">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-slate-500"
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </MainAdminAuthPage>
  );
}
