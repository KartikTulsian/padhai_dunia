"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const LoaderContext = createContext({
  loading: false,
  setLoading: (state: boolean) => {},
});

export const useLoader = () => useContext(LoaderContext);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // minimum display time
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
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
