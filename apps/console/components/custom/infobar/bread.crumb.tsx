"use client";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import React from "react";
import Notifications from "./notifications";
import { useApiKeyStore } from "@prexo/store";

function getPageDescription(page: string): string {
  if (page.includes("settings")) {
    return "Manage your account settings, preferences and integrations";
  }
  if (page.includes("dashboard")) {
    return "A detailed overview of your metrics, usage, customers and more";
  }
  if (page.includes("history")) {
    return "View and manage agent's chat histories";
  }
  if (page.includes("context")) {
    return "View and manage agent's memory context";
  }
  if (page.includes("playground")) {
    return "Experiment and test your agents in a live environment";
  }
  return "Modify domain settings, change chatbot options, enter sales questions and train your bot to do what you want it to.";
}

export default function InfobarBreadCrumb() {
  const page = usePathname();
  const { key } = useApiKeyStore();

  return (
    <div className="flex flex-col w-full items-start justify-center mt-2 mb-4">
      <div className="flex w-full gap-5 items-center justify-between">
        <div className="flex gap-5 items-center">
          <h2 className="text-2xl md:text-4xl font-uxum font-bold capitalize">
            {(() => {
              const segments = page.replace(/^\/+/, "").split("/");
              return segments.length > 1
                ? segments[segments.length - 1]
                : segments[0];
            })()}
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
        <div className="flex gap-2 mr-4">
          <Button variant={"outline"} size={"sm"}>
            <span className="inline-flex items-center">
              <svg
                height="12"
                width="12"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="currentColor">
                  <ellipse
                    cx="9.5"
                    cy="3.75"
                    fill="none"
                    rx="6.25"
                    ry="2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                  />
                  <path
                    d="M3.25,3.75v3c0,1.104,2.798,2,6.25,2s6.25-.896,6.25-2V3.75"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                  />
                  <path
                    d="M2.25,11.25v3c0,1.104,2.798,2,6.25,2s6.25-.896,6.25-2v-3"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                  />
                  <path
                    d="M3.311,10.135c-.67,.319-1.061,.702-1.061,1.115,0,1.104,2.798,2,6.25,2s6.25-.896,6.25-2c0-.223-.119-.438-.33-.638"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                  />
                  <line
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    x1="9.5"
                    x2="9.5"
                    y1="5.75"
                    y2="8.75"
                  />
                  <line
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    x1="6.25"
                    x2="6.25"
                    y1="5.458"
                    y2="8.458"
                  />
                  <line
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    x1="12.75"
                    x2="12.75"
                    y1="5.458"
                    y2="8.458"
                  />
                  <line
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    x1="8.5"
                    x2="8.5"
                    y1="13.25"
                    y2="16.25"
                  />
                  <line
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    x1="5.25"
                    x2="5.25"
                    y1="12.958"
                    y2="15.958"
                  />
                  <line
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    x1="11.75"
                    x2="11.75"
                    y1="12.958"
                    y2="15.958"
                  />
                </g>
              </svg>
            </span>
            {key.remaining ? key.remaining : "0"}
          </Button>
          <Notifications />
          {/* <Button variant="outline" size="icon" aria-label="Audit">
        <History />
        </Button> */}
        </div>
      </div>
      <p className="text-muted-foreground text-sm md:text-lg font-sans pl-0">
        {getPageDescription(page)}
      </p>
    </div>
  );
}
