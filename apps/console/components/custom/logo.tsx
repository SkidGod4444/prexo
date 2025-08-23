import { logoUrl } from "@prexo/utils/constants";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface LogoProps {
  height?: number;
  width?: number;
  alt?: string;
  isCollapsed?: boolean;
  isTextVisible?: boolean;
}

export default function Logo({
  height,
  width,
  alt,
  isCollapsed,
  isTextVisible = true,
}: LogoProps) {
  const [displayText, setDisplayText] = useState("");
  const fullText = "PREXO AI";

  useEffect(() => {
    if (isCollapsed) {
      setDisplayText("");
    } else if (isTextVisible) {
      // Show text letter by letter
      let currentLength = 0;
      const interval = setInterval(() => {
        if (currentLength < fullText.length) {
          setDisplayText(fullText.slice(0, currentLength + 1));
          currentLength++;
        } else {
          clearInterval(interval);
        }
      }, 50); // Adjust speed as needed

      return () => clearInterval(interval);
    } else {
      setDisplayText("");
    }
  }, [isCollapsed, isTextVisible]);

  return (
    <div className="flex flex-row items-center gap-2 cursor-pointer">
      <Image
        src={logoUrl}
        height={height ?? 50}
        width={width ?? 40}
        alt={alt ?? "logo"}
        className="invert transition-all duration-300 ease-in-out dark:invert-0"
      />
      {!isCollapsed && isTextVisible && (
        <span className="text-2xl font-uxum font-bold p-2">{displayText}</span>
      )}
    </div>
  );
}
