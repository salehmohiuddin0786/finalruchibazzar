"use client";

import { useMemo, useSyncExternalStore } from "react";
import { CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";
import SuperLayout from "../SuperLayout/page";
import {
  getMainAdminSessionSnapshot,
  parseMainAdminSession,
  subscribeToMainAdminSession,
} from "../lib/api";

const getServerSessionSnapshot = () => "";

export default function Profile() {
  const sessionSnapshot = useSyncExternalStore(
    subscribeToMainAdminSession,
    getMainAdminSessionSnapshot,
    getServerSessionSnapshot
  );
  const session = useMemo(() => parseMainAdminSession(sessionSnapshot), [sessionSnapshot]);
  const admin = session?.user || {};
  const adminName = admin.name || "Super Admin";
  const adminEmail = admin.email || "admin@ruchibazaar.com";
  const initials = adminName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const profileItems = [
    { label: "Full Name", value: adminName, icon: UserRound },
    { label: "Email Address", value: adminEmail, icon: Mail },
    { label: "Access Role", value: "Main Admin", icon: ShieldCheck },
    { label: "Session Status", value: session?.token ? "Signed in" : "Checking", icon: CalendarDays },
  ];

  return (
    <SuperLayout>
      <div className="min-w-0 space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold text-slate-950 sm:text-3xl">Profile</h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-500">
              Main admin account details used for dashboard access and audit activity.
            </p>
          </div>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xl font-bold text-white">
              {initials || "SA"}
            </div>
            <div className="min-w-0">
              <h2 className="break-words text-xl font-bold text-slate-950">{adminName}</h2>
              <p className="mt-1 break-words text-sm text-slate-500">{adminEmail}</p>
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
            {profileItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Icon className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-wide">{item.label}</p>
                  </div>
                  <p className="mt-3 break-words text-sm font-bold text-slate-950">{item.value}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </SuperLayout>
  );
}
