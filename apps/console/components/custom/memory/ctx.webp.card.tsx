"use client";
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2Icon, PlusIcon, AlertCircleIcon, LinkIcon } from "lucide-react";

// Helper to extract URLs from pasted text (supports multiple, newline/comma/space separated)
function extractUrls(text: string): string[] {
  // Split by whitespace, comma, or newline, filter out empty
  const parts = text
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Only keep those that look like URLs (with or without protocol)
  return parts.filter((part) => {
    // Accept if it looks like a domain or has protocol
    return (
      /^https?:\/\/\S+/i.test(part) || /^[\w-]+\.[\w.-]+(\/\S*)?$/i.test(part)
    );
  });
}

export default function CtxWebpagesCard() {
  const [webpages, setWebpages] = useState<
    { id: string; url: string; error?: string }[]
  >([]);
  const [isAdding, setIsAdding] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const pasteBoxRef = useRef<HTMLDivElement | null>(null);

  // Add a new empty input
  const handleAddWebpage = () => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setWebpages((prev) => [...prev, { id, url: "" }]);
    setIsAdding(true);
    setTimeout(() => {
      const ref = inputRefs.current[id];
      if (ref) ref.focus();
    }, 100);
  };

  // Add multiple links at once
  const handleAddMultipleWebpages = useCallback((urls: string[]) => {
    if (!urls.length) return;
    setWebpages((prev) => [
      ...prev,
      ...urls.map((url) => {
        // Remove https:// prefix if present
        const cleanUrl = url.startsWith("https://") ? url.slice(8) : url;
        return {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          url: cleanUrl,
          error: cleanUrl && !isValidUrl(cleanUrl) ? "Invalid URL" : undefined,
        };
      }),
    ]);
    setIsAdding(false);
  }, []);

  // Remove a webpage input
  const handleRemoveWebpage = (id: string) => {
    setWebpages((prev) => prev.filter((w) => w.id !== id));
  };

  // Update the value of a webpage input
  const handleChange = (id: string, value: string) => {
    // Remove https:// prefix if present
    const cleanValue = value.startsWith("https://") ? value.slice(8) : value;
    setWebpages((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              url: cleanValue,
              error:
                cleanValue && !isValidUrl(cleanValue)
                  ? "Invalid URL"
                  : undefined,
            }
          : w,
      ),
    );
  };

  // Simple URL validation
  function isValidUrl(url: string) {
    try {
      if (!url) return true;
      let testUrl = url;
      if (!/^https?:\/\//i.test(url)) {
        testUrl = "https://" + url;
      }
      new URL(testUrl);
      return true;
    } catch {
      return false;
    }
  }

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
            >
              <PlusIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Add Link
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Links ({webpages.length})</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddWebpage}
                type="button"
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
                      className="peer ps-16"
                      placeholder="devwtf.in"
                      type="text"
                      value={webpage.url}
                      onChange={(e) => handleChange(webpage.id, e.target.value)}
                      autoFocus={isAdding && idx === webpages.length - 1}
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
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
                  {webpage.error && (
                    <div
                      className="text-destructive flex items-center gap-1 text-xs mt-1 absolute left-0 -bottom-5"
                      role="alert"
                    >
                      <AlertCircleIcon className="size-3 shrink-0" />
                      <span>{webpage.error}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
