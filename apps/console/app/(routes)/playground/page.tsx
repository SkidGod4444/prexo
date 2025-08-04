"use client";
import InfobarBreadCrumb from "@/components/custom/infobar/bread.crumb";
import ChatPanel from "@/components/custom/playground/chat/chat";
import ChatHeader from "@/components/custom/playground/header";
import { useSidebar } from "@/components/ui/sidebar";
import React, { useEffect } from "react";

export default function Playground() {
  const { setOpen, state } = useSidebar();

  useEffect(() => {
    if (state === "expanded") {
      setOpen(false);
    }
  }, [setOpen, state]);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <ChatHeader />
      <ChatPanel chatId="3nm" />
    </div>
  );
}
