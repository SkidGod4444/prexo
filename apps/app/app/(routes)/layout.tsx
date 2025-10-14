import NavBar from "@/components/custom/navbar/navbar";
import React from "react";

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <NavBar />
      <div className="flex items-center justify-center overflow-hidden">
        {children}
      </div>
    </main>
  );
}
