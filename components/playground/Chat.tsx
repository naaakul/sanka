"use client";

import { useState } from "react";
import Image from "next/image";

const Chat = ({ initialMessage }: { initialMessage: string }) => {
  const [input, setInput] = useState("");

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col rounded-lg border border-neutral-800 overflow-hidden">
      <div className="relative flex-1 overflow-y-auto" id="scroll-container">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>

        <div className="px-4 py-4 space-y-6 max-w-3xl mx-auto">
          {initialMessage && (
            <div className="flex flex-col items-end group">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 bg-white rounded-full overflow-hidden">
                  {/* <img
                    src="https://vercel.com/api/www/avatar/e51bb2f302e32e0f30bf0e7316211783274e8ce0"
                    className="w-full h-full object-cover"
                    alt="User"
                  /> */}
                </span>
              </div>
              <div className="relative bg-neutral-800 px-3 py-2 rounded-2xl max-w-[80%] text-sm">
                {initialMessage}
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
          )}

          <div className="flex flex-col items-start group">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full overflow-hidden flex justify-center items-center bg-neutral-600 p-0.5">
                <Image alt="" height={100} width={100} src={"/logo.svg"} />
              </span>
            </div>
            <div className="relative bg-neutral-900  px-3 py-2 rounded-2xl max-w-[80%] text-sm">
              Let me read the content of your text attachment to understand…
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
      </div>

      <div className="border-t border-neutral-800 p-3 flex items-center gap-2">
        <textarea
          rows={1}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 resize-none bg-transparent outline-none text-sm placeholder-neutral-500"
        />
        <button className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm hover:bg-neutral-700 transition">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
