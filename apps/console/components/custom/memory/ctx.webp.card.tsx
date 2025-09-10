"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2Icon,
  PlusIcon,
  AlertCircleIcon,
  LinkIcon,
} from "lucide-react";
import { extractUrls } from "@/lib/utils";
import { useLinksStore } from "@prexo/store";
import { useReadLocalStorage } from "usehooks-ts";

interface WebpageItem {
  id: string;
  url: string;
  error?: string;
  timestamp: number;
  isCreating?: boolean;
}

export default function CtxWebpagesCard() {
  const consoleId = useReadLocalStorage("@prexo-#consoleId");
  const containerId = useReadLocalStorage("@prexo-#containerId");
  const {links, addLink, removeLink, setLinks} = useLinksStore();
  const [webpages, setWebpages] = useState<WebpageItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const pasteBoxRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const LINK_API_ENDPOINT = process.env.NODE_ENV === "production" ? "https://api.prexoai.xyz/v1/link" : "http://localhost:3001/v1/link";

  // Get existing links for this container
  const existingLinks = links.filter(link => link.containerId === containerId);

  // Fetch links from API on component mount
  const fetchLinks = useCallback(async () => {
    if (!containerId) return;
    
    try {
      const response = await fetch(`${LINK_API_ENDPOINT}/${containerId}/all`, {
        credentials: "include",
        headers: {
          "x-project-id": typeof consoleId === "string" ? consoleId : "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLinks(data.links || []);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  }, [containerId, consoleId, LINK_API_ENDPOINT, setLinks]);

  // Fetch links on mount
  useEffect(() => {
    if (containerId) {
      fetchLinks();
    }
  }, [containerId, fetchLinks]);

  // Combine existing links with webpages for display
  const allItems = [
    ...existingLinks.map(link => ({
      id: link.id,
      url: link.url,
      isExisting: true,
      timestamp: new Date(link.createdAt).getTime(),
      error: undefined,
      isCreating: false
    })),
    ...webpages.map(webpage => ({
      id: webpage.id,
      url: webpage.url,
      error: webpage.error,
      isCreating: webpage.isCreating,
      isExisting: false,
      timestamp: webpage.timestamp
    }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  // Check if URL already exists in links store
  const isUrlDuplicate = useCallback((url: string): boolean => {
    if (!containerId) return false;
    return links.some(link => 
      link.url === url && link.containerId === containerId
    );
  }, [links, containerId]);

  // Create links via API
  const createLinks = useCallback(async (webpageItems: WebpageItem[]) => {
    if (!containerId) return;

    const validWebpages = webpageItems.filter(w => w.url && !w.error && !isUrlDuplicate(w.url));
    
    if (validWebpages.length === 0) return;

    // Mark webpages as creating
    setWebpages(prev => 
      prev.map(w => 
        validWebpages.some(vw => vw.id === w.id) 
          ? { ...w, isCreating: true }
          : w
      )
    );

    try {
      const createPromises = validWebpages.map(async (webpage) => {
        const response = await fetch(`${LINK_API_ENDPOINT}/create`, {
          method: 'POST',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            "x-project-id": typeof consoleId === "string" ? consoleId : "",
          },
          body: JSON.stringify({
            url: webpage.url,
            containerId,
            type: 'webpage'
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create link: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Created link:", result.link);
        return result.link;
      });

      const createdLinks = await Promise.all(createPromises);
      
      // Add created links to store
      createdLinks.forEach(link => addLink(link));
      
      // Remove successfully created webpages from state
      setWebpages(prev => 
        prev.filter(w => !validWebpages.some(vw => vw.id === w.id))
      );
      
      // Refresh links from API to ensure consistency
      await fetchLinks();
      
    } catch (error) {
      console.error('Error creating links:', error);
      // Reset creating state on error
      setWebpages(prev => 
        prev.map(w => ({ ...w, isCreating: false }))
      );
    }
  }, [containerId, addLink, isUrlDuplicate, LINK_API_ENDPOINT, consoleId, fetchLinks]);

  // Effect to handle delayed API calls
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set timeout if there are valid webpages
    const validWebpages = webpages.filter(w => w.url && !w.error && !w.isCreating);
    if (validWebpages.length > 0) {
      timeoutRef.current = setTimeout(() => {
        createLinks(validWebpages);
      }, 8000); // 8 second delay
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [webpages, createLinks]);

  // Add a new empty input
  const handleAddWebpage = () => {
    if (allItems.length >= 2) return;
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
      const availableSlots = 2 - allItems.length;
      if (availableSlots <= 0) return;
      const urlsToAdd = urls.slice(0, availableSlots);
      setWebpages((prev) => [
        ...prev,
        ...urlsToAdd.map((url) => {
          // Remove http(s):// prefix if present
          const cleanUrl = url.replace(/^https?:\/\//i, "");
          const validation = isValidUrl(cleanUrl);
          const isDuplicate = isUrlDuplicate(cleanUrl);
          return {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            url: cleanUrl,
            error: validation.isValid 
              ? (isDuplicate ? "Link already exists" : undefined)
              : validation.error,
            timestamp: Date.now(),
          };
        }),
      ]);
      setIsAdding(false);
    },
    [allItems.length, isUrlDuplicate],
  );

  // Remove a webpage input
  const handleRemoveWebpage = (id: string) => {
    setWebpages((prev) => prev.filter((w) => w.id !== id));
  };

  // Delete a link from the store
  const handleDeleteLink = async (linkId: string) => {
    if (!consoleId) return;
    
    try {
      const response = await fetch(`${LINK_API_ENDPOINT}/delete`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "x-project-id": typeof consoleId === "string" ? consoleId : "",
        },
        body: JSON.stringify({ id: linkId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete link: ${response.statusText}`);
      }

      // Remove from store
      removeLink(linkId);
      // Refresh links from API to ensure consistency
      await fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  // Delete all existing links
  const handleDeleteAllExistingLinks = async () => {
    if (!consoleId || existingLinks.length === 0) return;
    
    try {
      const deletePromises = existingLinks.map(link => 
        fetch(`${LINK_API_ENDPOINT}/delete`, {
          method: 'DELETE',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            "x-project-id": typeof consoleId === "string" ? consoleId : "",
          },
          body: JSON.stringify({ id: link.id }),
        })
      );

      const responses = await Promise.all(deletePromises);
      
      // Check if all deletions were successful
      const allSuccessful = responses.every(response => response.ok);
      
      if (allSuccessful) {
        // Remove all existing links from store
        existingLinks.forEach(link => removeLink(link.id));
        // Refresh links from API to ensure consistency
        await fetchLinks();
      } else {
        throw new Error('Some deletions failed');
      }
    } catch (error) {
      console.error('Error deleting all links:', error);
    }
  };

  // Update the value of a webpage input
  const handleChange = (id: string, value: string) => {
    // Remove http(s):// prefix if present
    const cleanValue = value.replace(/^https?:\/\//i, "");

    // Validate the URL
    const validation = isValidUrl(cleanValue);
    const isDuplicate = cleanValue ? isUrlDuplicate(cleanValue) : false;

    setWebpages((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              url: cleanValue,
              error: validation.isValid 
                ? (isDuplicate ? "Link already exists" : undefined)
                : validation.error,
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
  const isCreating = webpages.some((w) => w.isCreating);

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
      {allItems.length === 0 ? (
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
              disabled={allItems.length >= 2 || isCreating}
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
              Links ({allItems.length})
              {hasInvalidUrls && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                  <AlertCircleIcon className="size-3" />
                  {webpages.filter((w) => w.error).length} invalid
                </span>
              )}
              {isCreating && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Syncing...
                </span>
              )}
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddWebpage}
                type="button"
                disabled={allItems.length >= 2 || isCreating}
              >
                <PlusIcon className="-ms-1 opacity-60" aria-hidden="true" />
                Add Link
              </Button>
              {webpages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWebpages([])}
                  type="button"
                  disabled={isCreating}
                >
                  <Trash2Icon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  Remove all
                </Button>
              )}
              {existingLinks.length > 0 && webpages.length === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteAllExistingLinks}
                  type="button"
                  disabled={isCreating}
                >
                  <Trash2Icon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  Remove all
                </Button>
              )}
            </div>
          </div>
          <div className="bg-background overflow-hidden rounded-2xl border p-2">
            <div className="flex flex-col *:not-first:mt-2">
              {allItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative group flex items-start gap-2"
                >
                  <div className="relative flex-1">
                    {item.isExisting ? (
                      <div className="flex items-center gap-1 p-2 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground text-sm">https://</span>
                        <span className="text-sm font-medium">{item.url}</span>
                      </div>
                    ) : (
                      <>
                        <Input
                          id={item.id}
                          ref={(el) => {
                            inputRefs.current[item.id] = el;
                          }}
                          className={`peer ps-16 ${
                            item.error
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : ""
                          } ${item.isCreating ? "opacity-50" : ""}`}
                          placeholder="devwtf.in"
                          type="text"
                          value={item.url}
                          onChange={(e) => handleChange(item.id, e.target.value)}
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
                              handleChange(item.id, sanitizedText);
                            }
                          }}
                          autoFocus={isAdding && idx === webpages.length - 1}
                          disabled={item.isCreating}
                        />
                        <span
                          className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50"
                          title="Links will be treated as HTTPS by default"
                        >
                          https://
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:text-red-600 size-8 mt-0.5"
                    aria-label={`Remove ${item.url || "webpage"}`}
                    onClick={() => 
                      item.isExisting 
                        ? handleDeleteLink(item.id)
                        : handleRemoveWebpage(item.id)
                    }
                    type="button"
                    disabled={item.isCreating}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
