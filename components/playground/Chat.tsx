"use client";

import { useState, useRef, useEffect } from "react";
import { ChatSession } from "@/lib/types/codeChat.types";
import { createAuthClient } from "better-auth/react";
import Image from "next/image";
import Input from "@/components/playground/Input";

// const mockChat: ChatSession = {
//   turns: [
//     {
//       user: ["Hey AI, can you make me a button component?"],
//       bot: {
//         messages:
//           "Sure! Here’s a simple React button component using Tailwind:",
//         code: [
//           {
//             path: "components/Button.tsx",
//             content:
//               "export default function Button({ label, onClick }: { label: string; onClick: () => void }) {\n  return (\n    <button onClick={onClick} className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>\n      {label}\n    </button>\n  );\n}",
//           },
//         ],
//       },
//     },
//     {
//       user: ["Looks good, but can you make it disabled sometimes?"],
//       bot: {
//         messages: "Yep — added a `disabled` prop for you:",
//         code: [
//           {
//             path: "components/Button.tsx",
//             content:
//               "export default function Button({ label, onClick, disabled = false }: { label: string; onClick: () => void; disabled?: boolean }) {\n  return (\n    <button\n      onClick={onClick}\n      disabled={disabled}\n      className={`px-4 py-2 rounded text-white ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}\n    >\n      {label}\n    </button>\n  );\n}",
//           },
//         ],
//       },
//     },
//     {
//       user: ["Perfect, thanks!"],
//       bot: {
//         messages: "",
//         code: [],
//       },
//     },
//   ],
// };

export const { useSession } = createAuthClient();

interface ChatProps {
  chatSession: ChatSession;
  setPrompt: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Chat({ chatSession, setPrompt }: ChatProps) {
  const { data: session, isPending } = useSession();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chatSession]);

  function handleSend() {
    if (!input.trim()) return;
    setPrompt(input.trim());
    setInput("");
  }

  return (
    <div className="h-full bg-[#0a0a0a] text-white flex flex-col rounded-lg border border-neutral-800 overflow-hidden">
      <div
        className="relative flex-1 overflow-y-auto"
        id="scroll-container"
        ref={scrollRef}
      >
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

        <div className="px-4 py-4 space-y-3 max-w-3xl mx-auto">
          {chatSession.turns.map((turn, i) => (
            <div key={i} className="space-y-3">
              {/* user bubble */}
              {/* <div className="flex justify-end"> */}
              <div className="flex flex-col w-full items-end ">
                <div className="rounded-full h-7 w-7 mr-1 mb-1 overflow-hidden">
                  {!isPending && session && (
                    <Image
                      src={
                        session.user.image ??
                        "https://avatars.githubusercontent.com/u/178046049?s=200&v=4"
                      }
                      alt="User Profile"
                      width={40}
                      height={40}
                      className="rounded-full size-7"
                    />
                  )}
                </div>

                <div className="relative bg-neutral-800 px-3 py-2 rounded-lg max-w-[60%] text-sm">
                  {turn.user.join(" ")}
                  <svg
                    width="16"
                    height="16"
                    className="absolute -top-[6px] right-0 text-neutral-800"
                    fill="currentColor"
                  >
                    <path d="M0 6.19355C8 6.19355 12 4.12903 16 0C16 6.70968 16 13.5 10 16L0 6.19355Z"></path>
                  </svg>
                </div>
              </div>
              {/* </div> */}

              {/* bot bubble */}
              {/* <div className="flex justify-start"> */}
              <div className="flex flex-col w-full ">
                <div className="rounded-full h-7 w-7 mr-1 mb-1 flex justify-center items-center bg-neutral-600 text-xs">
                  AI
                </div>

                <div className="relative bg-neutral-900 px-3 py-2 rounded-lg max-w-[60%] w-fit text-sm">
                  {turn.bot.messages !== "" ? (
                    turn.bot.messages
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="sr-only">Thinking</span>
                      <div className="flex gap-1 items-center">
                        <span
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ animationDelay: "0.12s" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ animationDelay: "0.24s" }}
                        />
                      </div>
                      <span className="text-neutral-500 ml-3 text-xs">
                        Thinking…
                      </span>
                    </div>
                  )}
                  <svg
                    width="16"
                    height="16"
                    className="absolute -top-[6px] left-0 text-neutral-900"
                    fill="currentColor"
                  >
                    <path d="M16 6.19355C8 6.19355 4 4.12903 0 0C0 6.70968 0 13.5 6 16L16 6.19355Z"></path>
                  </svg>
                </div>
              </div>
              {/* </div> */}
            </div>
          ))}
        </div>
      </div>

      {/* input */}
      <div className="p-3 flex items-center">
        <Input
          placeholders={"Ask a follow-up"}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        />
        {/* <textarea
          rows={1}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 resize-none bg-transparent outline-none text-sm placeholder-neutral-500"
        />
        <button
          onClick={handleSend}
          className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm hover:bg-neutral-700 transition"
        >
          Send
        </button> */}
      </div>

      {/* bouncing dots */}
      <style jsx>{`
        .animate-bounce {
          display: inline-block;
          background: #9ca3af;
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 9999px;
          animation: chat-bounce 0.6s infinite ease-in-out;
        }
        @keyframes chat-bounce {
          0% {
            transform: translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-6px);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
