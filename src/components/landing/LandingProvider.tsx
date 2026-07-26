"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface FormPrefill {
  negocio: string;
  tareas: string;
}

interface LandingContextValue {
  prefill: FormPrefill | null;
  setPrefill: (prefill: FormPrefill) => void;
}

const LandingContext = createContext<LandingContextValue | null>(null);

export function LandingProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<FormPrefill | null>(null);
  return (
    <LandingContext.Provider value={{ prefill, setPrefill }}>{children}</LandingContext.Provider>
  );
}

export function useLandingPrefill(): LandingContextValue {
  const ctx = useContext(LandingContext);
  if (!ctx) throw new Error("useLandingPrefill must be used within a LandingProvider");
  return ctx;
}
