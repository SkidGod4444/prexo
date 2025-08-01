"use client";
import { usePathname } from "next/navigation";
import React from "react";

function getPageDescription(page: string): string {
  if (page.includes("settings")) {
    return "Manage your account settings, preferences and integrations";
  }
  if (page.includes("dashboard")) {
    return "A detailed overview of your metrics, usage, customers and more";
  }
  if (page.includes("integrations")) {
    return "View and edit all your integrations";
  }
  if (page.includes("mails")) {
    return "View and manage all your email communications";
  }
  if (page.includes("workflows")) {
    return "Design and manage your automation workflows";
  }
  if (page.includes("agents")) {
    return "Manage your agents and their settings";
  }
  return "Modify domain settings, change chatbot options, enter sales questions and train your bot to do what you want it to.";
}

export default function InfobarBreadCrumb() {
  const page = usePathname();

  return (
    <div className="flex flex-col w-full items-start justify-center mt-2 mb-4">
      <div className="flex gap-5 items-center">
        <h2 className="text-2xl md:text-4xl font-uxum font-bold capitalize">
          {page.replace(/^\/+/, "")}
        </h2>
        {/* {page === 'conversation' && chatRoom && (
              <Loader
                loading={loading}
                className="p-0 inline"
              >
                <Switch
                  defaultChecked={realtime}
                  onClick={(e) => onActivateRealtime(e)}
                  className="data-[state=checked]:bg-orange data-[state=unchecked]:bg-peach"
                />
              </Loader>
            )} */}
      </div>
      <p className="text-muted-foreground text-sm md:text-lg font-sans pl-0">
        {getPageDescription(page)}
      </p>
    </div>
  );
}
