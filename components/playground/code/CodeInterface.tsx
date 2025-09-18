"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import FileTree from "./FileTree";
import { EditorBreadcrumb } from "./EditorTabs";
import { MonacoEditor } from "./MonacoEditor";
import { CodeConfig } from "@/lib/types/codeChat.types";

interface OpenFile {
  path: string;
  name: string;
  content: string;
  isDirty: boolean;
}

interface CodeInterfaceProps {
  version: string | null;     
  config: CodeConfig | null; 
}

export const CodeInterface = ({ version, config }: CodeInterfaceProps) => {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [currentFile, setCurrentFile] = useState<OpenFile | null>(null);

  const normalize = (p: string) => p.replace(/^\/+/, "");

  const openFileInEditor = useCallback(
    (path: string) => {
      const normalized = normalize(path);

      const existing = openFiles.find((f) => normalize(f.path) === normalized);
      if (existing) {
        setCurrentFile(existing);
        return existing;
      }

      const fileFromConfig = (config?.files ?? []).find(
        (f) => normalize(f.path) === normalized
      );

      const fileName = normalized.split("/").pop() || normalized;

      const newFile: OpenFile = {
        path: normalized,
        name: fileName,
        content: fileFromConfig?.content ?? "",
        isDirty: false,
      };

      setOpenFiles((prev) => [...prev, newFile]);
      setCurrentFile(newFile);

      return newFile;
    },
    [config, openFiles]
  );

  const handleContentChange = useCallback((path: string, content: string) => {
    const normalized = normalize(path);
    setOpenFiles((prev) =>
      prev.map((f) =>
        normalize(f.path) === normalized ? { ...f, content, isDirty: true } : f
      )
    );
    setCurrentFile((prev) =>
      prev && normalize(prev.path) === normalized
        ? { ...prev, content, isDirty: true }
        : prev
    );
  }, []);

  const handleClose = useCallback(
    (path: string) => {
      const normalized = normalize(path);
      setOpenFiles((prev) => {
        const next = prev.filter((f) => normalize(f.path) !== normalized);
        if (currentFile && normalize(currentFile.path) === normalized) {
          const last = next[next.length - 1] ?? null;
          setCurrentFile(last);
        }
        return next;
      });
    },
    [currentFile]
  );

  useEffect(() => {
    if (!config || !version) return;

    if (config.files.length > 0) {
      const prefer = config.files.find((f) =>
        ["app/layout.tsx", "app/page.tsx", "index.tsx"].includes(
          normalize(f.path)
        )
      );

      const defaultFile = prefer || config.files[0];

      const newOpenFile: OpenFile = {
        path: normalize(defaultFile.path),
        name: defaultFile.path.split("/").pop() || defaultFile.path,
        content: defaultFile.content,
        isDirty: false,
      };

      setOpenFiles([newOpenFile]);
      setCurrentFile(newOpenFile);
    } else {
      // fallback
      setOpenFiles([]);
      setCurrentFile(null);
    }
  }, [version, config]);

  const [leftWidth, setLeftWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;

      const clamped = Math.min(Math.max(newLeftWidth, 15), 40);
      setLeftWidth(clamped);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="h-screen bg-neutral-950 text-white flex flex-col"
    >
      <div className="flex flex-1 overflow-hidden h-full">
        <div
          className="border-r border-neutral-800 bg-neutral-900 overflow-y-auto h-full"
          style={{ width: `${leftWidth}%` }}
        >
          <FileTree
            config={config ?? { files: [] }}
            activeFile={currentFile?.path ?? null}
            onFileOpen={(p) => {
              openFileInEditor(p);
            }}
          />
        </div>

        <div
          onMouseDown={handleMouseDown}
          className="relative w-[1px] cursor-e-resize flex-shrink-0 before:absolute before:inset-y-0 before:-left-2 before:-right-2 before:bg-transparent before:content-['']"
        />

        <div
          style={{ width: `${100 - leftWidth}%` }}
          className="flex-1 flex flex-col"
        >
          {currentFile && (
            <EditorBreadcrumb
              path={currentFile.path}
              isDirty={currentFile.isDirty}
              onClose={() => handleClose(currentFile.path)}
            />
          )}

          <div className="flex-1">
            {currentFile ? (
              <MonacoEditor
                config={config ?? { files: [] }}
                activeFile={currentFile.path}
                onFileOpen={(p) => openFileInEditor(p)}
                onContentChange={(path, content) =>
                  handleContentChange(path, content)
                }
              />
            ) : (
              <div className="h-full bg-neutral-950 flex items-center justify-center">
                <div className="text-center text-neutral-700">
                  <h2 className="text-2xl mb-4">Welcome to SANKA</h2>
                  <p>Select a file from the explorer to start editing</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeInterface;
