"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Folder, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SessionItem {
  chatTitle: string;
  chatId: string;
}

interface SidebarProps {
  handleEnter: () => void;
  handleLeave: () => void;
  open: boolean;
}

export default function Sidebar({
  handleEnter,
  handleLeave,
  open,
}: SidebarProps) {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/sessions");
        if (!res.ok) throw new Error("Failed to fetch sessions");
        const data: SessionItem[] = await res.json();
        setSessions(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="fixed inset-y-0 left-0 z-50 pointer-events-none">
      <AnimatePresence>
        {open && (
          <motion.aside
            key="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            style={{ "--offset": "3.84rem" } as React.CSSProperties}
            className={cn(
              "pointer-events-auto z-60 fixed left-2 bottom-2 overflow-hidden rounded-lg h-[calc(100%-var(--offset))] w-[15.833333%] border bg-sidebar shadow"
            )}
          >
            <div className="flex h-full flex-col bg-neutral-950">
              <Button className="m-2 mb-0 bg-neutral-900 text-white text-md border hover:bg-neutral-800 cursor-pointer">
                New app
              </Button>

              <nav className="flex-1 p-2 pt-1">
                <ul className="flex flex-col gap-1">
                  <li>
                    <a
                      href="#"
                      className="flex gap-2 items-center text-md rounded-md px-3 py-2 text-sm cursor-pointer"
                    >
                      <Search className="size-4" />
                      Search
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex gap-2 items-center text-md rounded-md px-3 py-2 text-sm cursor-pointer"
                    >
                      <Folder className="size-4" />
                      Projects
                    </a>
                  </li>
                </ul>

                <ul className="flex flex-col gap-1 mt-4">
                  {sessions.map((s) => (
                    <li key={s.chatId}>
                      <button
                        onClick={() =>
                          router.push(`/playground/code?q=${s.chatId}`)
                        }
                        className="w-full text-left flex gap-2 items-center rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-neutral-800 text-white"
                      >
                        {s.chatTitle}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
