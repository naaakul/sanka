"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useChatFlush(chatId: string | null) {
  useEffect(() => {
    if (!chatId) return;

    // 1. Flush every 1h
    const interval = setInterval(() => {
      fetch("/api/chat/flush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId }),
      });
    }, 60 * 60 * 1000);

    // 2. Flush on tab close
    const handleUnload = () => {
      if (chatId) {
        navigator.sendBeacon(
          "/api/chat/flush",
          JSON.stringify({ chatId })
        );
      }
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [chatId]);

  // 3. Flush on route change
  const pathname = usePathname();
  useEffect(() => {
    return () => {
      if (pathname === "/playground/code" && chatId) {
        navigator.sendBeacon(
          "/api/chat/flush",
          JSON.stringify({ chatId })
        );
      }
    };
  }, [pathname, chatId]);
}
