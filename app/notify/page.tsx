/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Notify() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, [message]); // refresh count after a join

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message || "Something went wrong");
    setEmail("");
    setLoading(false);
  };

  useEffect(() => {
    if (!(window as any).UnicornStudio) {
      const script = document.createElement("script");
      script.src = "/js/unicornStudio.umd.js";
      script.async = true;
      script.onload = () => {
        if (!(window as any).UnicornStudio.isInitialized) {
          (window as any).UnicornStudio.init();
          (window as any).UnicornStudio.isInitialized = true;
        }
      };
      document.body.appendChild(script);
    } else {
      if (!(window as any).UnicornStudio.isInitialized) {
        (window as any).UnicornStudio.init();
        (window as any).UnicornStudio.isInitialized = true;
      }
    }
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center bg-black text-white">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div
          data-us-project="uOTm5yzh3ILhmmaCwRXz"
          className="absolute inset-0 w-full h-[200vh] overflow-hidden"
        ></div>
      </div>
      <div className="max-w-md w-full text-center p-6 rounded-2xl bg-neutral-900/75 backdrop-blur-xl shadow-xl flex flex-col items-center gap-2">
        <div className="h-6 overflow-hidden flex justify-center items-center">
          <Image
          alt=""
          src={"/sanka.svg"}
          height={200}
          width={1000}
          className="size-28 h-10"
        />
        </div>
        <h1>Join the Waitlist</h1>
        <p className="text-xs text-neutral-400 ">
          Sanka lets you create Next.js apps, AI agents, and animated videos —
          all in one unified platform. Your all-in-one creative engine for
          developers, designers, and dreamers to bring ideas to life
          effortlessly.
        </p>

          <p className="my-3 text-sm text-gray-300">
            {count ? count : 0} {count === 1 ? "person has" : "people have"} already joined
          </p>

        {message ? (
          <p
            className="text-[#cdc9f1]"
            // className={`${
            //   message.includes("already") ? "text-[#cdc9f1]" : "text-green-400"
            // }`}
          >
            {message}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 justify-between p-1 rounded-xl bg-black/40 text-white border border-white/30"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:outline-none w-full rounded-lg pl-4 bg-none"
            />
            <button
              type="submit"
              className="px-4 py-2 w-44 rounded-lg flex justify-center bg-[#7768AD] hover:bg-[#32273C] cursor-pointer transition text-white font-medium"
            >
              {loading ? <Loader2 className="animate-spin"/> : "Notify Me"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
