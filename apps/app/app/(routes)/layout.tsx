import type React from "react";
import NavBar from "@/components/custom/navbar/navbar";
import { MaintenanceCntxt } from "@/contexts/maintenance.cntxt";

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MaintenanceCntxt>
      <main>
        <NavBar />
        <div className="flex items-center justify-center overflow-hidden my-12 px-5 md:px-16 ">
          {children}
        </div>
      </main>
    </MaintenanceCntxt>
  );
}
