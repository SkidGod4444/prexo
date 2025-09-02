"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuditLogsStore } from "@prexo/store";
import { useReadLocalStorage } from "usehooks-ts";

function getActionBadgeVariant(action: string) {
  switch (action) {
    case "GET":
      return "default";
    case "DELETE":
      return "destructive";
    case "OTHER":
      return "secondary";
    default:
      return "secondary";
  }
}

export default function ActivityLogsTable() {
  const [visibleItems, setVisibleItems] = useState(50);
  const consoleId = useReadLocalStorage("@prexo-#consoleId");
  const { auditLogs } = useAuditLogsStore();
  const [hovered, setHovered] = useState(false);
  const [barHovered, setBarHovered] = useState(false);
  const isMobile = useIsMobile();
  const totalItems = auditLogs.length;
  const hasMore = visibleItems < totalItems;

  // For mobile: only set hovered to true on first touch, and never set to false on touchend (so it doesn't flicker)
  // For desktop: use mouseenter/mouseleave as before
  const tableRef = useRef<HTMLDivElement>(null);

  const handleTableMouseEnter = () => setHovered(true);
  const handleTableMouseLeave = () => setHovered(false);
  const handleTableTouchStart = () => {
    if (!hovered) setHovered(true);
  };
  // Don't set hovered to false on touchend, so the bar stays visible after first tap

  const handleBarMouseEnter = () => setBarHovered(true);
  const handleBarMouseLeave = () => setBarHovered(false);
  const handleBarTouchStart = () => setBarHovered(true);
  const handleBarTouchEnd = () => setBarHovered(false);

  // Show floating bar if either the table or the bar is hovered (desktop or mobile)
  const showFloatingBar = hasMore && (hovered || barHovered);

  const handleLoadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 10, totalItems));
  };

  return (
    <div className="mt-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative">
          <div
            ref={tableRef}
            className="border rounded-2xl overflow-auto"
            onMouseEnter={handleTableMouseEnter}
            onMouseLeave={handleTableMouseLeave}
            onTouchStart={isMobile ? handleTableTouchStart : undefined}
            // Don't set onTouchEnd for mobile, to avoid flicker
          >
            <Table>
              <TableHeader className="sticky top-0 bg-sidebar">
                <TableRow>
                  <TableHead className="font-medium">Time</TableHead>
                  <TableHead className="font-medium">Actor</TableHead>
                  <TableHead className="font-medium">Action</TableHead>
                  <TableHead className="font-medium">Endpoint</TableHead>
                  <TableHead className="font-medium">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.slice(0, visibleItems).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">
                      {new Date(row.time).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4">
                          {row.actor === "USER" ? "👤" : "🔑"}
                        </div>
                        <span className="font-mono text-sm">{row.actor}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getActionBadgeVariant(row.action)}
                        className="font-medium text-xs"
                      >
                        {row.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {(() => {
                        // Remove the consoleId from the endpoint if present
                        if (!row.endpoint || !consoleId) return row.endpoint;
                        // Match /something/:consoleId/...
                        const regex = new RegExp(
                          `(/v1/[^/]+/)${consoleId}(/|$)`,
                        );
                        if (regex.test(row.endpoint)) {
                          // Remove the consoleId segment
                          return row.endpoint.replace(regex, "$1");
                        }
                        return row.endpoint;
                      })()}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {row.credits}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <AnimatePresence>
            {showFloatingBar && (
              <motion.div
                className={
                  (isMobile
                    ? "fixed left-0 right-0 bottom-0 mx-auto w-full max-w-md"
                    : "absolute bottom-4 left-1/2 transform -translate-x-1/2") +
                  " bg-background border rounded-2xl shadow-xl px-4 py-2 z-10 flex flex-col items-center justify-center"
                }
                initial={{ opacity: 0, y: isMobile ? 48 : 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: isMobile ? 48 : 24, scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.25,
                }}
                onMouseEnter={handleBarMouseEnter}
                onMouseLeave={handleBarMouseLeave}
                onTouchStart={isMobile ? handleBarTouchStart : undefined}
                onTouchEnd={isMobile ? handleBarTouchEnd : undefined}
                style={
                  isMobile ? { borderRadius: "1.25rem 1.25rem 0 0" } : undefined
                }
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-muted-foreground text-center">
                    Viewing {visibleItems} of {totalItems} items
                  </span>
                  <Button
                    onClick={handleLoadMore}
                    size="sm"
                    className={isMobile ? "mt-2" : "ml-10"}
                  >
                    Load more
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
