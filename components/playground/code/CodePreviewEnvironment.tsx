"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DownloadIcon } from "lucide-react";
import PreviewPane from "./PreviewPane";
import { CodeInterface } from "./CodeInterface";
import { motion } from "framer-motion";
import JSZip from "jszip";
import { fileSave } from "browser-fs-access";
import { ChatSession, CodeFile, CodeConfig } from "@/lib/types/codeChat.types";
import VersionSelect from "@/components/ui/VersionSelect";

const categories = {
  ide: { label: "Code" },
  preview: { label: "Preview" },
};

interface NextIDEInterfaceProps {
  chat: ChatSession | null;
}

interface Version {
  version: string;
  code: CodeFile[] | undefined;
}

const NextIDEInterface: React.FC<NextIDEInterfaceProps> = ({ chat }) => {
  // filter versions from chatttt
  const versions: Version[] = useMemo(() => {
    if (!chat) return [];
    return chat.turns
      .map((turn, idx) => ({
        version: `v${idx + 1}`,
        code: turn.bot.code,
      }))
      .filter((v) => v.code && v.code.length > 0);
  }, [chat]);

  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [manualSelect, setManualSelect] = useState(false);

  useEffect(() => {
    if (versions.length === 0) return;

    const latestVersion = versions[versions.length - 1].version;

    if (!manualSelect) {
      setSelectedVersion(latestVersion);
    } else {
      if (
        selectedVersion !== latestVersion &&
        versions.findIndex((v) => v.version === latestVersion) >
          versions.findIndex((v) => v.version === selectedVersion)
      ) {
        setSelectedVersion(latestVersion);
        setManualSelect(false);
      }
    }
  }, [versions, selectedVersion, manualSelect]);

  const currentCode =
    versions.find((v) => v.version === selectedVersion)?.code || [];

  // wrap into CodeConfig
  const currentCodeConfig: CodeConfig = useMemo(() => {
    return { files: currentCode };
  }, [currentCode]);

  // download zippp
  async function handleDownload() {
    if (!currentCode || currentCode.length === 0) return;

    const zip = new JSZip();
    currentCode.forEach((file) => {
      zip.file(file.path, file.content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    fileSave(blob, {
      fileName: `${selectedVersion || "code"}.zip`,
    });
  }

  const [viewMode, setViewMode] = useState<"ide" | "preview">("ide");

  return (
    <div className="h-full bg-[#1e1e1e] text-white flex flex-col rounded-lg border border-neutral-800 overflow-hidden">
      <div className="bg-[#0F0F10] border-b border-neutral-900 p-2 flex items-center justify-between">
        {/* toggle buttons */}
        <div className="flex items-center justify-between p-1 rounded-xl relative backdrop-blur-md w-fit">
          {Object.entries(categories).map(([key, { label }]) => (
            <div
              key={key}
              onClick={() => setViewMode(key as "ide" | "preview")}
              className="relative cursor-pointer w-full group text-center py-1.5 px-4 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
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

        {/* version selector + download */}
        <div className="flex gap-2">
          <VersionSelect
            versionCount={versions.length}
            selectedVersion={selectedVersion}
            setSelectedVersion={(v) => {
              setSelectedVersion(v);
              setManualSelect(true);
            }}
          />
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-neutral-800 rounded-lg cursor-pointer"
          >
            <DownloadIcon className="size-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === "ide" ? (
          <CodeInterface version={selectedVersion} config={currentCodeConfig} />
        ) : (
          <PreviewPane version={selectedVersion} config={currentCodeConfig} />
        )}
      </div>
    </div>
  );
};

export default NextIDEInterface;
