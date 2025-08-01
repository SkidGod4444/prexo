"use client";
import InfobarBreadCrumb from "@/components/custom/infobar/bread.crumb";
import ApiKeySettings from "@/components/custom/settings/apikey.settings";
import ThemeSwitcher from "@/components/theme.switcher";
import React from "react";

export default function Settings() {
  return (
    <div className="flex flex-col items-start justify-start h-full w-full overflow-hidden">
      <InfobarBreadCrumb />
      <div className="flex flex-col gap-15">
        <ApiKeySettings />
        <ThemeSwitcher />
      </div>
    </div>
  );
}
