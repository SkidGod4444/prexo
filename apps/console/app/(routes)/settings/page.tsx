"use client";
import InfobarBreadCrumb from "@/components/custom/infobar/bread.crumb";
import ApiKeySettings from "@/components/custom/settings/apikey.settings";
import AppSettings from "@/components/custom/settings/app.settings";
import DomainsSettings from "@/components/custom/settings/domains.settings";
import EnvKeysSettings from "@/components/custom/settings/envkeys.settings";
import ThemeSwitcher from "@/components/custom/settings/theme.settings";
import React from "react";

export default function Settings() {
  return (
    <div className="flex flex-col items-start justify-start min-h-screen w-full overflow-hidden">
      <InfobarBreadCrumb />
      <div className="flex flex-col gap-16 mt-4">
        <AppSettings/>
        <DomainsSettings />
        <ApiKeySettings />
        <EnvKeysSettings />
        <ThemeSwitcher />
      </div>
    </div>
  );
}
