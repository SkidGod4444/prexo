import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function ChatPannel() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <Card
      className={`flex flex-col h-full p-0 w-full bg-black text-white transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen w-screen" : ""
      }`}
      //   style={isFullscreen ? { borderRadius: 0 } : {}}
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300 border border-zinc-700">
            <span className="mr-1">🧠</span> GPT-3.5 Turbo · Protect
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Minimize Button */}
          {isFullscreen ? (
            <button
              className="p-1 rounded hover:bg-zinc-800 transition"
              title="Minimize"
              aria-label="Minimize"
              onClick={() => setIsFullscreen(false)}
            >
              {/* Minimize Icon */}
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-zinc-400"
                aria-hidden="true"
              >
                <rect x="4" y="8" width="10" height="2" rx="1" />
              </svg>
            </button>
          ) : (
            <button
              className="p-1 rounded hover:bg-zinc-800 transition"
              title="Maximize"
              aria-label="Maximize"
              onClick={() => setIsFullscreen(true)}
            >
              {/* Maximize Icon */}
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-zinc-400"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="12" height="12" rx="2" />
              </svg>
            </button>
          )}
          {/* Info Button */}
          <button
            className="p-1 rounded hover:bg-zinc-800 transition"
            title="Info"
            aria-label="Info"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-zinc-400"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="7"></circle>
            </svg>
          </button>
        </div>
      </CardHeader>
      {/* Main Chat Area */}
      <CardContent className="flex-1 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-zinc-400 text-xs">
                OpenAI / GPT-3.5 Turbo Instruct
              </span>
            </div>
            <div className="text-zinc-300 text-sm">
              <p>
                Faster, capable, and API-compatible. Complete all legacy
                Completions endpoints except Chat Completions.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-xs text-zinc-400">
            <div className="flex justify-between">
              <span>Context</span>
              <span>4,096 tokens</span>
            </div>
            <div className="flex justify-between">
              <span>Input/Output</span>
              <span>512 / 2,048 tokens</span>
            </div>
            <div className="flex justify-between">
              <span>Group/Project</span>
              <span>FREE · public users</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4 text-xs text-zinc-500">
            <a href="#" className="hover:underline">
              Model Page
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Website
            </a>
          </div>
        </div>
      </CardContent>
      {/* Chat Input */}
      <CardFooter className="border-t border-zinc-800 bg-zinc-900 px-4 py-3 flex items-center">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 bg-zinc-800 text-zinc-200 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
        <button
          className="ml-2 p-2 rounded bg-primary text-white hover:bg-primary/80 transition"
          title="Send"
          aria-label="Send"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="inline-block"
            aria-hidden="true"
          >
            <path d="M3 10l13-5-5 13-2-6-6-2z"></path>
          </svg>
        </button>
      </CardFooter>
    </Card>
  );
}
