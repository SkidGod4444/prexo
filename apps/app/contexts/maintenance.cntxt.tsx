"use client";
import { createContext, type ReactNode, useContext } from "react";
import MaintenanceBanner from "@/components/custom/maintenance/banner";
import { useFeatureFlag } from "@/hooks/use-feature-flags";

type MaintenanceContextType = {
  isEnabled: boolean;
};

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(
  undefined,
);

export const MaintenanceCntxt = ({ children }: { children: ReactNode }) => {
  const { value: isEnabled } = useFeatureFlag("isMaintenanceModeEnabled");
  return (
    <MaintenanceContext.Provider value={{ isEnabled }}>
        {isEnabled && <MaintenanceBanner />}
        {children}
    </MaintenanceContext.Provider>
  );
};

export function useMaintenance(): MaintenanceContextType {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error("useMaintenance must be used within a MaintenanceCntxt");
  }
  return context;
}
