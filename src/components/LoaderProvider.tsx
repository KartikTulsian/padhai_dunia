"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type LoaderContextType = {
  loading: boolean;
  start: () => void;
  stop: () => void;
};

const LoaderContext = createContext<LoaderContextType | null>(null);

export const useLoader = () => {
  const ctx = useContext(LoaderContext);
  if (!ctx) {
    throw new Error("useLoader must be used inside LoaderProvider");
  }
  return ctx;
};

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const start = () => setLoading(true);
  const stop = () => setLoading(false);

  // 👉 when the route *finishes* changing (new pathname rendered),
  //    we auto-stop the loader after a tiny delay for a smooth feel
  useEffect(() => {
    if (!loading) return;

    const timer = setTimeout(() => {
      setLoading(false);
    }, 200); // small fade; tweak if you like

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <LoaderContext.Provider value={{ loading, start, stop }}>
      {children}

      {loading && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-9999">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
            <div className="absolute top-2 left-2 h-12 w-12 rounded-full border-4 border-transparent border-t-purple-500 animate-spin-slow"></div>
          </div>
        </div>
      )}
    </LoaderContext.Provider>
  );
}
