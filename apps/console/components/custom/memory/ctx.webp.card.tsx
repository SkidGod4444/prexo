"use client";
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2Icon,
  PlusIcon,
  AlertCircleIcon,
  LinkIcon,
} from "lucide-react";
import { extractUrls } from "@/lib/utils";
import { useLocalStorage } from "usehooks-ts";

// TODO: Make it working
export default function CtxWebpagesCard() {
  const [webpages, setWebpages] = useLocalStorage<
    {
      id: string;
      url: string;
      error?: string;
      timestamp: number;
    }[]
  >("@prexo-#ctxWebpages", []);

  const [isAdding, setIsAdding] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const pasteBoxRef = useRef<HTMLDivElement | null>(null);

  // Add a new empty input
  const handleAddWebpage = () => {
    if (webpages.length >= 2) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setWebpages((prev) => [
      ...prev,
      {
        id,
        url: "",
        timestamp: Date.now(),
      },
    ]);
    setIsAdding(true);
    setTimeout(() => {
      const ref = inputRefs.current[id];
      if (ref) ref.focus();
    }, 100);
  };

  // Add multiple links at once
  const handleAddMultipleWebpages = useCallback(
    (urls: string[]) => {
      if (!urls.length) return;
      const availableSlots = 2 - webpages.length;
      if (availableSlots <= 0) return;
      const urlsToAdd = urls.slice(0, availableSlots);
      setWebpages((prev) => [
        ...prev,
        ...urlsToAdd.map((url) => {
          // Remove http(s):// prefix if present
          const cleanUrl = url.replace(/^https?:\/\//i, "");
          const validation = isValidUrl(cleanUrl);
          return {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            url: cleanUrl,
            error: validation.isValid ? undefined : validation.error,
            timestamp: Date.now(),
          };
        }),
      ]);
      setIsAdding(false);
    },
    [setWebpages, webpages.length],
  );

  // Remove a webpage input
  const handleRemoveWebpage = (id: string) => {
    setWebpages((prev) => prev.filter((w) => w.id !== id));
  };

  // Update the value of a webpage input
  const handleChange = (id: string, value: string) => {
    // Remove http(s):// prefix if present
    const cleanValue = value.replace(/^https?:\/\//i, "");

    // Validate the URL
    const validation = isValidUrl(cleanValue);

    setWebpages((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              url: cleanValue,
              error: validation.isValid ? undefined : validation.error,
            }
          : w,
      ),
    );
  };

  // Enhanced URL validation
  function isValidUrl(url: string): { isValid: boolean; error?: string } {
    if (!url.trim()) {
      return { isValid: true }; // Empty is valid (placeholder)
    }

    // Check for common invalid characters
    if (/[<>"{}|\\^`\[\]]/.test(url)) {
      return { isValid: false, error: "Contains invalid characters" };
    }

    // Check for basic URL structure
    if (!/^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/.test(url)) {
      return { isValid: false, error: "Contains invalid URL characters" };
    }

    // Check for minimum length and structure
    if (url.length < 3) {
      return { isValid: false, error: "URL too short" };
    }

    // Check if it looks like a domain
    if (
      !/^[a-zA-Z0-9\-._]+\.[a-zA-Z]{2,}/.test(url) &&
      !/^[a-zA-Z0-9\-._]+\.[a-zA-Z0-9\-._]+\.[a-zA-Z]{2,}/.test(url)
    ) {
      return { isValid: false, error: "Invalid domain format" };
    }

    try {
      let testUrl = url;
      if (!/^https?:\/\//i.test(url)) {
        testUrl = "https://" + url;
      }
      new URL(testUrl);
      return { isValid: true };
    } catch {
      return { isValid: false, error: "Invalid URL format" };
    }
  }

  // Check if all URLs are valid
  const hasInvalidUrls = webpages.some((w) => w.error);

  // Handle paste event for the empty box
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const text = e.clipboardData.getData("text");
      const urls = extractUrls(text);
      if (urls.length > 0) {
        e.preventDefault();
        handleAddMultipleWebpages(urls);
      }
    },
    [handleAddMultipleWebpages],
  );

  return (
    <div className="flex flex-col gap-2">
      {webpages.length === 0 ? (
        <div
          className="border-input flex min-h-32 flex-col items-center rounded-xl border border-dashed p-4 transition-colors justify-center"
          ref={pasteBoxRef}
          tabIndex={0}
          onPaste={handlePaste}
          aria-label="Paste webpage links here"
          style={{ outline: "none" }}
        >
          <div className="flex flex-col items-center justify-center text-center w-full">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <LinkIcon className="size-4 opacity-60" />
            </div>
            <p className="text-sm font-medium">Add supported links</p>
            <span className="text-sm text-muted-foreground">
              Supported: pdf, csv, sites, llm.mdx, llm.txt
            </span>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="font-medium">Tip:</span> You can also{" "}
              <span className="font-semibold">paste links here</span> to add
              them automatically.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleAddWebpage}
              type="button"
              disabled={webpages.length >= 2}
            >
              <PlusIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Add Link
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">
              Links ({webpages.length})
              {hasInvalidUrls && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                  <AlertCircleIcon className="size-3" />
                  {webpages.filter((w) => w.error).length} invalid
                </span>
              )}
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddWebpage}
                type="button"
                disabled={webpages.length >= 2}
              >
                <PlusIcon className="-ms-1 opacity-60" aria-hidden="true" />
                Add Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWebpages([])}
                type="button"
              >
                <Trash2Icon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Remove all
              </Button>
            </div>
          </div>
          <div className="bg-background overflow-hidden rounded-2xl border p-2">
            <div className="flex flex-col *:not-first:mt-2">
              {webpages.map((webpage, idx) => (
                <div
                  key={webpage.id}
                  className="relative group flex items-start gap-2"
                >
                  <div className="relative flex-1">
                    <Input
                      id={webpage.id}
                      ref={(el) => {
                        inputRefs.current[webpage.id] = el;
                      }}
                      className={`peer ps-16 ${
                        webpage.error
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      placeholder="devwtf.in"
                      type="text"
                      value={webpage.url}
                      onChange={(e) => handleChange(webpage.id, e.target.value)}
                      onKeyDown={(e) => {
                        // Prevent invalid characters from being typed
                        const invalidChars = /[<>"{}|\\^`\[\]]/;
                        if (invalidChars.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        // Sanitize pasted content
                        const pastedText = e.clipboardData.getData("text");
                        if (/[<>"{}|\\^`\[\]]/.test(pastedText)) {
                          e.preventDefault();
                          // Replace invalid characters with empty string
                          const sanitizedText = pastedText.replace(
                            /[<>"{}|\\^`\[\]]/g,
                            "",
                          );
                          handleChange(webpage.id, sanitizedText);
                        }
                      }}
                      autoFocus={isAdding && idx === webpages.length - 1}
                    />
                    <span
                      className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50"
                      title="Links will be treated as HTTPS by default"
                    >
                      https://
                    </span>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:text-red-600 size-8 mt-0.5"
                    aria-label={`Remove ${webpage.url || "webpage"}`}
                    onClick={() => handleRemoveWebpage(webpage.id)}
                    type="button"
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                  {/* {webpage.error && (
                    <div
                      className="text-destructive flex items-center gap-1 text-xs mt-1 absolute left-0 -bottom-5"
                      role="alert"
                    >
                      <AlertCircleIcon className="size-3 shrink-0" />
                      <span>{webpage.error}</span>
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
