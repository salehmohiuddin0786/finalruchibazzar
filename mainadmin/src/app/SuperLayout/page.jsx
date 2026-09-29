"use client";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import SuperSidebar from "../components/SuperSidebar";
import SuperHeader from "../components/SuperHeader";
import {
  getMainAdminSessionSnapshot,
  parseMainAdminSession,
  subscribeToMainAdminSession,
} from "../lib/api";

const getServerSessionSnapshot = () => "";

const SuperLayout = ({ children }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sessionSnapshot = useSyncExternalStore(
    subscribeToMainAdminSession,
    getMainAdminSessionSnapshot,
    getServerSessionSnapshot
  );
  const session = useMemo(() => parseMainAdminSession(sessionSnapshot), [sessionSnapshot]);

  useEffect(() => {
    if (!session) {
      router.replace("/Login");
    }
  }, [router, session]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm font-medium text-white">
        Checking admin session...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gray-100">
      <SuperSidebar
        isMobileOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <SuperHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="min-w-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperLayout;
