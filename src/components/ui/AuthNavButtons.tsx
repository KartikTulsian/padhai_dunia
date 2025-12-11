"use client";

import Link from "next/link";

type AuthNavButtonsProps = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export default function AuthNavButtons({ variant = "desktop", onNavigate }: AuthNavButtonsProps) {
  const isDesktop = variant === "desktop";
  return (
    <div className={isDesktop ? "hidden md:flex items-center gap-3" : "flex md:hidden flex-col gap-3"}>
      <Link href="/login" onClick={onNavigate}>
        <button className={
          isDesktop
            ? "px-4 py-2 rounded-xl border border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/10 transition"
            : "w-full px-4 py-2 rounded-xl border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 transition"
        }>
          Log in
        </button>
      </Link>
      <Link href="/signup" onClick={onNavigate}>
        <button className={
          isDesktop
            ? "px-4 py-2 rounded-xl bg-cyan-500 text-white shadow hover:bg-cyan-400 hover:scale-105 transition-transform"
            : "w-full px-4 py-2 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition"
        }>
          Sign up
        </button>
      </Link>
    </div>
  );
}


