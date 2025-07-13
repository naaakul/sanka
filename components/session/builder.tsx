"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp} from "lucide-react";

const categories = {
  Agent: { label: "AI Agent" },
  Code: { label: "Code" },
  Video: { label: "Video" },
};

const builder = () => {
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof categories>("Agent");

  return (
    <div className="w-full z-20 flex flex-col items-center relative justify-center gap-2 mt-[27%]">
      <div className="absolute text-transparent bg-clip-text bg-gradient-to-b from-white/20  via-white/5 to-[#ffffff00] top-[-40%] -translate-y-1/2 text-[160px] xl:text-[200px] font-[Jost] select-none pointer-events-none z-0">
        Sanka
      </div>

      <div className="xl:max-w-3xl z-30 w-full h-12 bg-[#0A0A0A] rounded-full border border-y border-l border-r-0 border-[#292929] flex items-center">
        <input
          type="text"
          placeholder="What’s on your mind, maker?"
          className="flex-1 h-full rounded-full outline-0 caret-neutral-400 border-0 px-4 bg-transparent text-white"
        />

        <div className="p-1 h-full">
          <button className="h-full aspect-square bg-neutral-400 rounded-full shrink-0 flex items-center justify-center">
            <ArrowUp className="text-black w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between p-2 rounded-full relative bg-white/5 backdrop-blur-md w-full max-w-md mx-auto">
        {Object.entries(categories).map(([key, { label }]) => (
          <div
            key={key}
            onClick={() => setActiveCategory(key as keyof typeof categories)}
            className="relative cursor-pointer w-full group text-center py-1.5 overflow-visible hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.175, 0.885, 0.32, 1.275)] px-4"
          >
            {activeCategory === key && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-[#0A0A0A] rounded-full"
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
              className={`relative flex whitespace-nowrap text-white  text-xs sm:text-sm items-center gap-2 justify-center ${
                activeCategory === key
                  ? "text-primary-foreground"
                  : "text-foreground"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default builder;
