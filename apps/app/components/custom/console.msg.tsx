"use client";

import { useEffect } from "react";

export default function ConsoleMessage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(
        "%c👋 Hey Developer!",
        "color:#991b1b; font-size:40px; font-weight:bold;",
      );
      console.log(
        "%cHappy Debugging! 🚀\n\nPrexoAI is an opensource SaaS, feel free to contribute.\n\nImportant Links:\n-> https://git.new/prexo\n-> https://l.devwtf.in/plura-dc\n-> https://l.devwtf.in/plura-x\n\nOr you can just DM me: https://l.devwtf.in/x\n\n\nSUPPORT US BY SPONSORING ME: https://l.devwtf.in/sponsor",
        "color:#dc2626; font-size:20px;",
      );
    }
  }, []);

  return null; // nothing rendered
}
