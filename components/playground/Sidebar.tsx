"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Folder,
  Search,
} from "lucide-react";

interface SessionItem{
    title: string | null;
    id: string;
    createdAt: Date;
}[]

interface SidebarProps {
  handleEnter: () => void;
  handleLeave: () => void;
  open: boolean;
  sessions: SessionItem[];
}

export default function Sidebar({
  handleEnter,
  handleLeave,
  open,
  sessions = [],
}: SidebarProps) {
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
                      <Search className="size-4"/>
                      Search
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex gap-2 items-center text-md rounded-md px-3 py-2 text-sm cursor-pointer"
                    >
                      <Folder className="size-4"/>
                      Projects
                    </a>
                  </li>
                </ul>


                <ul className="flex flex-col gap-1">
                  {sessions.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`/chat/${s.id}`}
                        className="flex gap-2 items-center rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-neutral-800 text-white"
                      >
                        {s.title ?? "Untitled"}
                      </a>
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
