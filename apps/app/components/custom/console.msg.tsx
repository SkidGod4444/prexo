"use client";

import { useEffect } from "react";

export default function ConsoleMessage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(
        "%c👋 Hey developer!",
        "color:#991b1b; font-size:40px; font-weight:bold;",
      );
      console.log(
        "%cThis is a private internal tool built by our team. If you're interested in learning more about it, feel free to reach out!\n\n Happy coding! 🚀",
        "color:#dc2626; font-size:20px;",
      );
    }
  }, []);

  return null; // nothing rendered
}
