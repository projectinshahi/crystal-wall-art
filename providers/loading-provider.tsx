"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type LoadingContextType = {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(0);

  const startLoading = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setCount((prev) => Math.max(prev - 1, 0));
  }, []);

  const value = useMemo(
    () => ({
      loading: count > 0,
      startLoading,
      stopLoading,
    }),
    [count]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}

      {/* Elegant Admin Spinner */}
      {count > 0 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-sm">
          
          <div className="relative flex items-center justify-center">
            
            {/* Soft Glow */}
            <div className="absolute h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

            {/* Spinner */}
            <div className="admin-spinner" />
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error(
      "useGlobalLoading must be used within LoadingProvider"
    );
  }

  return context;
}