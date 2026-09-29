"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  Utensils,
  Crown,
  Chrome,
} from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import UnderReviewPopup from "../components/UnderReviewPopup";

const UNDER_REVIEW_CODE = "RESTAURANT_UNDER_REVIEW";
const UNDER_REVIEW_MESSAGE =
  "Your restaurant account is being reviewed by our admin team. You can login after approval.";

const parseApiResponse = async (response) => {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const Login = () => {
  const router = useRouter();
  const isMounted = useRef(true);
  const redirectTimeoutRef = useRef(null);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showUnderReviewPopup, setShowUnderReviewPopup] = useState(false);

  const redirectByRole = useCallback(
    (role) => {
      if (role === "admin") router.replace("/Dashboard");
      else if (role === "partner") router.replace("/");
      else router.replace("/");
    },
    [router]
  );

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const user =
          localStorage.getItem("user") || sessionStorage.getItem("user");
        const restaurant =
          localStorage.getItem("restaurant") ||
          sessionStorage.getItem("restaurant");

        if (token && user) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", user);
          if (restaurant) localStorage.setItem("restaurant", restaurant);
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("restaurant");

          const userData = JSON.parse(user);
          redirectByRole(userData.role);
          return;
        }
      } catch {
        localStorage.clear();
        sessionStorage.clear();
      } finally {
        if (isMounted.current) setIsCheckingAuth(false);
      }
    };

    const timeout = setTimeout(checkAuth, 100);

    return () => {
      isMounted.current = false;
      clearTimeout(timeout);
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, [redirectByRole]);

  const handleEmailChange = useCallback(
    (e) => {
      setEmail(e.target.value);
      if (error) setError("");
      if (showUnderReviewPopup) setShowUnderReviewPopup(false);
    },
    [error, showUnderReviewPopup]
  );

  const handlePasswordChange = useCallback(
    (e) => {
      setPassword(e.target.value);
      if (error) setError("");
      if (showUnderReviewPopup) setShowUnderReviewPopup(false);
    },
    [error, showUnderReviewPopup]
  );

  const saveAuthData = (data) => {
    const userData = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone,
      role: data.user.role,
    };

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurant");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("restaurant");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));

    if (data.restaurant) {
      localStorage.setItem("restaurant", JSON.stringify(data.restaurant));
    }

    const maxAge = rememberMe ? 2592000 : 3600;
    document.cookie = `token=${data.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await parseApiResponse(response);

      if (!response.ok) {
        if (data.code === UNDER_REVIEW_CODE) {
          setShowUnderReviewPopup(true);
          setIsLoading(false);
          return;
        }
        throw new Error(data.message || "Login failed");
      }

      if (!data.token || !data.user) {
        throw new Error("Invalid login response from server");
      }

      saveAuthData(data);

      redirectTimeoutRef.current = setTimeout(() => {
        redirectByRole(data.user.role);
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading || isGoogleLoading) return;

    setError("");

    try {
      setIsGoogleLoading(true);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const firebaseResult = await signInWithPopup(auth, provider);
      const firebaseIdToken = await firebaseResult.user.getIdToken();

      const response = await fetch("http://localhost:5000/api/auth/google-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ firebaseIdToken }),
      });

      const data = await parseApiResponse(response);

      if (!response.ok) {
        if (data.code === UNDER_REVIEW_CODE) {
          setShowUnderReviewPopup(true);
          return;
        }
        throw new Error(data.message || "Google login failed");
      }

      if (!data.token || !data.user) {
        throw new Error("Invalid login response from server");
      }

      saveAuthData(data);
      redirectTimeoutRef.current = setTimeout(() => {
        redirectByRole(data.user.role);
      }, 100);
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.message || "Google login failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-black rounded-2xl mb-4 animate-pulse">
            <Utensils className="h-8 w-8 text-white" />
          </div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <UnderReviewPopup
        open={showUnderReviewPopup}
        onClose={() => setShowUnderReviewPopup(false)}
        message={UNDER_REVIEW_MESSAGE}
      />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600 rounded-full opacity-20 animate-pulse blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-700 rounded-full opacity-20 animate-pulse delay-1000 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-red-500 rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-red-500/30">
        <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-black"></div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-black rounded-2xl mb-4 shadow-lg">
              <Utensils className="h-10 w-10 text-white" />
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
              Login
            </h1>

            <p className="text-red-200 text-sm mt-2 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3" />
              Welcome back to Ruchi Bazaar
              <Sparkles className="h-3 w-3" />
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
              <p className="text-sm text-red-200 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-red-200 ml-1">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-red-300" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-red-500/30 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none text-white placeholder-red-300/50"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-red-200 ml-1">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-red-300" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-black/50 border border-red-500/30 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none text-white placeholder-red-300/50"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-red-300 hover:text-red-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-red-600"
                  disabled={isLoading}
                />
                <span className="text-sm text-red-200">Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-red-300 hover:text-red-100 hover:underline"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-gradient-to-r from-red-600 to-black text-white font-semibold py-3 px-4 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight size={20} />}
              </span>
            </button>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-red-500/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-red-300">
                  or
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="w-full border-2 border-red-500/50 text-red-200 font-semibold py-3 px-4 rounded-xl hover:bg-red-600/20 hover:border-red-500 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isGoogleLoading ? (
                "Connecting..."
              ) : (
                <>
                  <Chrome size={20} />
                  Continue with Google
                </>
              )}
            </button>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-red-500/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-red-300">
                  New partner?
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full border-2 border-red-500/50 text-red-200 font-semibold py-3 px-4 rounded-xl hover:bg-red-600/20 hover:border-red-500"
              disabled={isLoading}
            >
              Create Partner Account
            </button>
          </form>

          <div className="mt-6 p-4 bg-gradient-to-r from-red-950/50 to-black/50 rounded-xl border border-red-500/20">
            <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Partner Benefits:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-red-300/80">
              <span>• Restaurant dashboard</span>
              <span>• Order management</span>
              <span>• Real-time analytics</span>
              <span>• Menu management</span>
              <span>• Sales reports</span>
              <span>• 24/7 support</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-red-400/70">
            <Shield className="h-3 w-3" />
            <span>Secure login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
