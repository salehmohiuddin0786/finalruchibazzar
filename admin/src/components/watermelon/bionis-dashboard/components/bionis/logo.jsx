"use client";

import React from "react";
import { UtensilsCrossed } from "lucide-react";

export function BionisLogo({ className, ...props }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-md shadow-red-500/20 ${className || "size-7"}`}
      {...props}
    >
      <UtensilsCrossed className="size-4 text-white" />
    </div>
  );
}
