/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { ChatSession } from "@/lib/types/codeChat.types";
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
//               "export default function Button({ label, onClick }: { label: string; onClick: () => void }) {\n return (\n <button onClick={onClick} className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>\n {label}\n </button>\n );\n}",
//           },
//         ],
//       },
//     },
//     {
//       user: ["Looks good, but can you make it disabled sometimes?"],
//       bot: {
//         messages: "Yep — added a disabled prop for you:",
//         code: [
//           {
//             path: "components/Button.tsx",
//             content:
//               "export default function Button({ label, onClick, disabled = false }: { label: string; onClick: () => void; disabled?: boolean }) {\n return (\n <button\n onClick={onClick}\n disabled={disabled}\n className={px-4 py-2 rounded text-white ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}}\n >\n {label}\n </button>\n );\n}",
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

interface ChatProps {
  // chatSession?: ChatSession;
  chatId: string | null;
  // setPrompt: React.Dispatch<React.SetStateAction<string | null>>;
  useSession: any;
  chat: ChatSession | null;
  setChat: React.Dispatch<React.SetStateAction<ChatSession | null>>;
}

export default function Chat({ chatId, useSession, chat, setChat }: ChatProps) {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState<boolean>(!!chatId);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);


  // fatch dataaa for the chat
  useEffect(() => {
    if (!chatId) return;

    let aborted = false;
    async function fetchChat() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/generate/code/chat/${chatId}`);
        if (!res.ok) {
          const err = await res
            .json()
            .catch(() => ({ error: "Failed to fetch" }));
          throw new Error(err?.error || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!aborted) setChat(data);
      } catch (err: any) {
        if (!aborted) setError(err.message ?? "Unknown error");
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    fetchChat();

    return () => {
      aborted = true;
    };
  }, [chatId]);

  // generate code and send data to rediss
  const generatingRef = useRef(false);

  async function generateForLastTurn(promptText: string) {
    if (!chatId) return;
    if (generatingRef.current) return;

    generatingRef.current = true;
    try {
      const res = await fetch("/api/generate/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, prompt: promptText }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("generate API error:", text);
        return;
      }
      
      const body = await res.json();

      console.log("this is the code - ", body.bot.code);

      if (body.bot) {
        setChat((prev) => {
          if (!prev) return prev;
          const next = { ...prev, turns: [...prev.turns] };
          const idx = next.turns.length - 1;
          next.turns[idx] = {
            ...next.turns[idx],
            bot: {
              messages: body.bot.messages ?? next.turns[idx].bot.messages,
              code: body.bot.code ?? next.turns[idx].bot.code ?? [],
            },
          };
          return next;
        });

        await fetch("/api/generate/code/chat/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: chatId,
            role: "bot",
            content: body.bot.messages,
          }),
        }).catch((err) => console.error("persist bot message failed:", err));
      }
    } catch (err) {
      console.error("generateForLastTurn failed:", err);
    } finally {
      generatingRef.current = false;
    }
  }

  useEffect(() => {
    if (!chat) return;
    const turns = chat.turns;
    if (!turns || turns.length === 0) return;

    const last = turns[turns.length - 1];
    const userHasText =
      Array.isArray(last.user) && last.user.join(" ").trim() !== "";
    const botEmpty = !last.bot?.messages || last.bot.messages.trim() === "";

    if (userHasText && botEmpty && chatId && !generatingRef.current) {
      generateForLastTurn(last.user.join(" "));
    }
  }, [chat, chatId]);

  // sending prompts to radis
  async function handleSend() {
    if (!input.trim() || !chatId) return;

    const promptText = input.trim();
    setInput("");

    setChat((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        turns: [
          ...prev.turns,
          { user: [promptText], bot: { messages: "", code: [] } },
        ],
      };
    });

    try {
      const res = await fetch(`/api/generate/code/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, prompt: promptText }),
      });

      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();

      setChat(updated);
    } catch (err) {
      console.error("handleSend failed:", err);
    }
  }

  // scrolling chat down 
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const t = setTimeout(
      () => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }),
      50
    );
    return () => clearTimeout(t);
  }, [chat]);


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
          {loading && (
            <div className="text-sm text-neutral-500">Loading chat…</div>
          )}
          {error && <div className="text-sm text-red-400">Error: {error}</div>}

          {chat?.turns?.length
            ? chat.turns.map((turn, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex flex-col w-full items-end ">
                    <div className="rounded-full h-7 w-7 mr-1 mb-1 overflow-hidden">
                      {!isPending && session && (
                        <Image
                          src={
                            session.user?.image ??
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
                </div>
              ))
            : !loading && (
                <div className="text-sm text-neutral-500">No messages yet</div>
              )}
        </div>
      </div>

      <div className="p-3 flex items-center">
        <Input
          placeholders={"Ask a follow-up"}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          // value={input}
        />
      </div>

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
