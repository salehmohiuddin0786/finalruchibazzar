"use client";

import React, { createContext, useContext, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const DashboardNavigationContext = createContext(null);

export function DashboardNavigationProvider({ children }) {
  const router = useRouter();
  const currentPath = usePathname() || "/";

  const value = useMemo(
    () => ({
      pathname: currentPath,
      navigate: (path) => router.push(path),
    }),
    [currentPath, router]
  );

  return (
    <DashboardNavigationContext.Provider value={value}>
      {children}
    </DashboardNavigationContext.Provider>
  );
}

export function useDashboardNavigation() {
  const context = useContext(DashboardNavigationContext);
  const router = useRouter();
  const currentPath = usePathname() || "/";

  if (!context) {
    return {
      pathname: currentPath,
      navigate: (path) => router.push(path),
    };
  }

  return context;
}

export function DashboardLink({ href, onClick, children, ...props }) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
