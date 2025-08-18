"use client";

import Chat from "@/components/playground/Chat";
import NextIDEInterface from "@/components/playground/code/CodePreviewEnvironment";
import PlaygroundNavbar from "@/components/playground/PlaygroundNavbar";
import { PlaygroundPanels } from "@/components/playground/PlaygroundPanels";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CodeConfig {
  files: {
    path: string;
    type: "text" | "binary";
    language: string;
    executable: boolean;
    content: string;
  }[];
}

const Page = () => {
  const [config, setConfig] = useState<CodeConfig>({ files: [] });
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("q");
  const [prompt, setPrompt] = useState(initialMessage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!prompt) return;

    const cached = localStorage.getItem(`result:${prompt}`);
    if (cached) {
      // setResult(JSON.parse(cached));
      setConfig(JSON.parse(cached));
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/generate/code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        const data = await res.json();
        // setResult(data);
        setConfig(data);

        localStorage.setItem(`result:${prompt}`, JSON.stringify(data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [prompt]);

  return (
    <div className="h-screen flex flex-col">
      <PlaygroundNavbar />
      <PlaygroundPanels
        leftPanel={
          <div className="pl-2 pb-2">
            <Chat initialMessage={initialMessage ?? ""} />
          </div>
        }
        rightPanel={
          <div className="pr-2 pb-2">
            <NextIDEInterface config={config} loading={loading} />
          </div>
        }
        defaultLeftWidth={50}
        minLeftWidth={30}
        maxLeftWidth={60}
      />
    </div>
  );
};

export default Page;
