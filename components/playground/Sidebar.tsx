"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface SidebarProps {
  handleEnter: () => void;
  handleLeave: () => void;
  open: boolean;
}

export default function Sidebar({handleEnter, handleLeave, open}: SidebarProps) {

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
              "pointer-events-auto z-60 fixed left-2 bottom-2 rounded-lg h-[calc(100%-var(--offset))] w-[20.833333%] border bg-sidebar shadow"
            )}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" role="img" aria-hidden="true">
                      <path d="M12 2.75l2.834 6.089 6.716.517-5.097 4.377 1.537 6.5L12 16.96 6.01 20.233l1.537-6.5-5.097-4.377 6.716-.517L12 2.75z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">Pigstar</span>
                </div>
              </div>

              <nav className="flex-1 p-4">
                <ul className="flex flex-col gap-2">
                  {["Dashboard", "Projects", "Reports", "Settings"].map((item) => (
                    <li key={item}>
                      <a href="#" className="block rounded-md px-3 py-2 text-sm hover:bg-accent">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="border-t p-4 text-xs text-muted-foreground">Hover the Pigstar logo to open</div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
