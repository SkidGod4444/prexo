"use client";

import { useEffect, useState } from "react";
import { BellIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { toast } from "sonner";
import { NotificationType } from "@prexo/types";
import { useRouter } from "next/navigation";
import { formatDateTimeAgo } from "@/lib/utils";

const nEndpoint =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/notification"
    : "https://api.prexoai.xyz/v1/notification";

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const unreadCount = notifications.filter((n) => !n.isSeen).length;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      // Wrap the fetch in a toast.promise
      toast.promise(
        (async () => {
          const res = await fetch(`${nEndpoint}/all`, {
            credentials: "include",
          });
          if (!res.ok) {
            throw new Error("Error while fetching notifications!");
          }
          const data = await res.json();
          if (data.notifications) {
            setNotifications(data.notifications);
          }
          return { name: "Notifications" };
        })(),
        {
          loading: "Loading...",
          success: (data) => {
            setIsLoading(false);
            return `${data.name} fetched successfully!`;
          },
          error: (err) => {
            setIsLoading(false);
            console.log("Error while fetching notifications!", err);
            return "Error";
          },
        }
      );
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAllAsRead = async () => {
    const ids = notifications.map((notification) => notification.id);
    if (ids.length === 0) return;

    await fetch(`${nEndpoint}/mark-as-seen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ids }),
    });

    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isSeen: true,
      })),
    );

    toast.success("Marked all notifications as seen!")
  };

  const handleNotificationClick = async (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    await fetch(`${nEndpoint}/mark-as-seen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ids: [id] }),
    });

    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, isSeen: true } : n
      ),
    );

    if (notification && notification.url) {
      router.push(notification.url);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="relative"
          aria-label="Open notifications"
        >
          <BellIcon size={12} aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1 mr-2">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="text-xs font-medium hover:underline cursor-pointer"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="bg-border -mx-1 my-1 h-px"
        ></div>
        {isLoading || notifications.length == 0 ? (
          // Skeletons for loading state
          <>
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-md px-3 py-2 text-sm animate-pulse flex items-start gap-3 pe-3"
              >
                <div className="size-9 rounded-md bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 bg-muted rounded" />
                  <div className="h-2 w-1/3 bg-muted rounded" />
                </div>
                <div className="size-2 rounded-full bg-muted self-center" />
              </div>
            ))}
          </>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
            >
              <div className="relative flex items-start gap-3 pe-3">
                <Image
                  className="size-9 rounded-md"
                  src={notification.icon!}
                  width={32}
                  height={32}
                  alt={notification.id}
                />
                <div className="flex-1 space-y-1 cursor-pointer">
                  <button
                    className="text-foreground/80 text-left after:absolute after:inset-0 cursor-pointer"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <span className="text-foreground font-medium hover:underline">
                      {notification.title}
                    </span>
                    <span className="text-foreground font-medium hover:underline">
                      {notification.desc}
                    </span>
                  </button>
                  <div className="text-muted-foreground text-xs">
                    {formatDateTimeAgo(notification.createdAt)}
                  </div>
                </div>
                {!notification.isSeen && (
                  <div className="absolute end-0 self-center">
                    <Dot />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
}
