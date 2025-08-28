"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Loader2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import AuthModal, { AuthModalRef } from "./auth-modal";
import { createAuthClient } from "better-auth/react";

const categories = {
  agent: { label: "AI Agent" },
  code: { label: "Code" },
  video: { label: "Video" },
};

const clickSound =
  typeof Audio !== "undefined"
    ? new Audio("https://kprverse.com/audio/UI_menu_rollover.mp3")
    : null;
export const { useSession } = createAuthClient();

const Builder = () => {
  const { data: session } = useSession();
  const modalRef = useRef<{ open: () => void }>(null);
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof categories>("code");
  const [input, setInput] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const authModalRef = useRef<AuthModalRef>(null);


  const handleSubmit = () => {
    if (!session) {
      modalRef.current?.open();
      return;
    }
    if (!input.trim()) return;
    setLoading(true);
    router.push(`/playground/${activeCategory}?q=${encodeURIComponent(input)}`);
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  const handleCategoryClick = (key: keyof typeof categories) => {
    setActiveCategory(key);

    if (clickSound) {
      clickSound.currentTime = 0; 
      clickSound.play();
    }
  };

  const handleAction = () => {
    if (!session) {
      authModalRef.current?.open();
      return;
    }
    handleSubmit();
  };

  return (
    <div className="w-full z-20 flex flex-col items-center relative justify-center gap-3 sm:gap-4">
      {/* Background Text */}
      {/* <div className="absolute text-transparent bg-clip-text bg-gradient-to-b bg-blur from-[#84778C]/80 via-[#84778C]/50 to-[#ffffff00] top-[-40px] sm:top-[-30px] xl:top-[-40px] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[80px] sm:text-[120px] md:text-[160px] xl:text-[200px] font-[Jost] select-none pointer-events-none z-0 whitespace-nowrap">
        Sanka
      </div> */}

      {/* Search Input */}
      <>
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg xl:max-w-3xl z-30 h-10 sm:h-12 bg-background rounded-full border border-[#292929] flex items-center">
          <input
            type="text"
            placeholder="What's on your mind, maker?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAction();
              }
            }}
            className="flex-1 h-full rounded-full outline-0 caret-neutral-400 border-0 px-3 sm:px-4 bg-transparent text-foreground text-sm sm:text-base placeholder:text-neutral-500 placeholder:text-sm sm:placeholder:text-base"
          />
          <div className="p-1 h-full">
            <button
              onClick={() => handleAction()}
              disabled={loading}
              className="h-full aspect-square bg-neutral-400 rounded-full shrink-0 flex items-center justify-center hover:bg-neutral-300 transition-colors duration-200 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin text-black w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ArrowUp className="text-black w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
              )}
            </button>
          </div>
        </div>

        <AuthModal ref={authModalRef} />
      </>

      {/* Category Selector */}
      <div className="flex items-center justify-between p-1.5 sm:p-2 rounded-full relative bg-black/40 backdrop-blur-xl w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        {Object.entries(categories).map(([key, { label }]) => (
          <div
            key={key}
            onClick={() => handleCategoryClick(key as keyof typeof categories)}
            className="relative cursor-pointer w-full group text-center py-1.5 sm:py-2 overflow-visible transition-all duration-300 ease-[cubic-bezier(0.175, 0.885, 0.32, 1.275)] px-2 sm:px-4"
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
              className={`relative flex whitespace-nowrap text-white text-xs sm:text-sm items-center gap-2 justify-center ${
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

export default Builder;
