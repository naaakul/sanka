"use client";

import React, { useState } from "react";
import { DownloadIcon } from "lucide-react";
import PreviewPane from "./PreviewPane";
import { VSCodeInterface } from "./CodeInterface";
import { motion } from "framer-motion";

const categories = {
  ide: { label: "Code" },
  preview: { label: "Preview" },
};

const NextIDEInterface: React.FC = () => {
  // const [selectedFile, setSelectedFile] = useState("/app/page.tsx");
  const [currentCode, setCurrentCode] = useState("");
  // const [currentFileName, setCurrentFileName] = useState("page.tsx");
  const [viewMode, setViewMode] = useState<"ide" | "preview">("ide");

  // const handleFileSelect = (path: string, content: string) => {
  //   setSelectedFile(path);
  //   setCurrentCode(content);
  //   setCurrentFileName(path.split("/").pop() || "file");
  // };

  React.useEffect(() => {
    const defaultContent = `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <h1 className="text-4xl font-bold">
          Welcome to Next.js!
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50 text-balance">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  )
}`;
    setCurrentCode(defaultContent);
  }, []);

  // const handleCodeChange = (newCode: string) => {
  //   setCurrentCode(newCode);
  // };

  return (
    <div className="h-screen bg-[#1e1e1e] text-white flex flex-col">
      <div className="bg-[#0F0F10] border-b border-[#1A1A1A] px-4 py-2 flex items-center justify-between">
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
          <VSCodeInterface />
        ) : (
          <PreviewPane code={currentCode} fileName={"page.tsx"} />
        )}
      </div>
    </div>
  );
};

export default NextIDEInterface;
