"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

/* ================= API ================= */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= CONTEXT ================= */

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- INIT AUTH ---------- */
  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (!isMounted) return;
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  /* ---------- AXIOS INTERCEPTOR ---------- */
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, []);

  /* ================= LOGIN ================= */

  const login = async ({ email, password, token, user: sessionUser }) => {
    try {
      if (token && sessionUser) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(sessionUser));
        setUser(sessionUser);

        return {
          success: true,
          user: sessionUser,
          token,
        };
      }

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const data = res.data;

      if (!data?.token || !data?.user) {
        return {
          success: false,
          error: "Invalid server response",
        };
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Login failed";

      return {
        success: false,
        error: msg,
      };
    }
  };

  /* ================= REGISTER ================= */

  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);

      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error?.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  /* ================= VALUE ================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
