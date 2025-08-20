"use client";

import React, { useState } from "react";
import { DownloadIcon } from "lucide-react";
import PreviewPane from "./PreviewPane";
import { CodeInterface } from "./CodeInterface";
import { motion } from "framer-motion";

interface CodeConfig {
  files: {
    path: string;
    content: string;
  }[];
}

const categories = {
  ide: { label: "Code" },
  preview: { label: "Preview" },
};

interface NextIDEInterfaceProps {
  config: CodeConfig;
  loading: boolean;
}

const NextIDEInterface: React.FC<NextIDEInterfaceProps> = ({config, loading}) => {
  const [viewMode, setViewMode] = useState<"ide" | "preview">("ide");

  return (
    <div className="h-screen bg-[#1e1e1e] text-white flex flex-col rounded-lg border border-neutral-800 overflow-hidden">
      <div className="bg-[#0F0F10] border-b border-neutral-900 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center justify-between p-1 rounded-xl relative  backdrop-blur-md w-fit">
          {Object.entries(categories).map(([key, { label }]) => (
            <div
              key={key}
              onClick={() => setViewMode(key as "ide" | "preview")}
              className="relative cursor-pointer w-full group text-center py-1.5 px-4 overflow-visible transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
            >
              {viewMode === key && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-[#222223] rounded-md z-0"
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 10,
                    mass: 0.2,
                    ease: [0, 1, 0.35, 0],
                  }}
                />
              )}
              <span
                className={`relative z-10 text-white text-sm font-medium ${
                  viewMode === key ? "text-[#FFFFFF]" : "text-white/80"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <div>
          <DownloadIcon className="size-5" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === "ide" ? (
          <CodeInterface {...config} />
        ) : (
          <PreviewPane {...config}/>
        )}
      </div>
    </div>
  );
};

export default NextIDEInterface;
