"use client";

import React, { useEffect, useState } from "react";
import { CodeConfig } from "@/lib/types/codeChat.types";


const PreviewPane = (config: CodeConfig) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runSandbox = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/generate/code/sandbox", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        });

        const data = await res.json();
        if (data.success) {
          setPreviewUrl(data.previewUrl);
        } else {
          console.error("Sandbox error:", data.error);
          setPreviewUrl(null);
        }
      } catch (err) {
        console.error("Request failed:", err);
        setPreviewUrl(null);
      } finally {
        setLoading(false);
      }
    };

    if (config?.files?.length > 0) {
      runSandbox();
    }
  }, [config]);

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm text-gray-300">Preview</span>
      </div>

      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Starting sandbox...
          </div>
        )}

        {!loading && previewUrl && (
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        )}

        {!loading && !previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-red-400">
            Failed to load preview
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPane;
