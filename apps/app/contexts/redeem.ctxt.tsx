"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface RedeemContextType {
  redeemCode: string | null;
  clearRedeemCode: () => void;
}

const RedeemContext = createContext<RedeemContextType | undefined>(undefined);

export const RedeemCntxt = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const [redeemCode, setRedeemCode] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("redeem");
    if (code) {
      console.log("Redeem code detected:", code);
      setRedeemCode(code);
    }
  }, [searchParams]);

  const clearRedeemCode = () => {
    setRedeemCode(null);
  };

  return (
    <RedeemContext.Provider value={{ redeemCode, clearRedeemCode }}>
      {children}
      
    </RedeemContext.Provider>
  );
};

export const useRedeem = () => {
  const context = useContext(RedeemContext);
  if (context === undefined) {
    throw new Error("useRedeem must be used within a RedeemCntxt");
  }
  return context;
};
