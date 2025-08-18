"use client";

import React, { useEffect, useState, useCallback } from "react";
import FileTree from "./FileTree";
import { EditorBreadcrumb } from "./EditorTabs";
import { MonacoEditor } from "./MonacoEditor";

interface OpenFile {
  path: string;
  name: string;
  content: string;
  isDirty: boolean;
}

interface CodeConfig {
  // project: {
  //   name: string;
  //   description: string;
  //   stack: string[];
  //   packageManager: "npm" | "pnpm" | "yarn" | string;
  // };
  files: {
    path: string;
    type: "text" | "binary";
    language: string;
    executable: boolean;
    content: string;
  }[];
  // scripts: {
  //   dev: string;
  //   build: string;
  //   start: string;
  //   [key: string]: string;
  // };
  // run: {
  //   install: string;
  //   dev: string;
  //   build: string;
  //   start: string;
  //   [key: string]: string;
  // };
}




export const CodeInterface = (config: CodeConfig) => {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [currentFile, setCurrentFile] = useState<OpenFile | null>(null);

  // Normalize path helper
  const normalize = (p: string) => p.replace(/^\/+/, "");

  // The function the editor tree will call to open/focus a file.
  const openFileInEditor = useCallback(
    (path: string) => {
      const normalized = normalize(path);

      // If open already, just focus it
      const existing = openFiles.find((f) => normalize(f.path) === normalized);
      if (existing) {
        setCurrentFile(existing);
        return existing;
      }

      // Find file content in config
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

  // Called by Monaco when user edits a file
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

  // Close a file/tab
  const handleClose = useCallback(
    (path: string) => {
      const normalized = normalize(path);
      setOpenFiles((prev) => {
        const next = prev.filter((f) => normalize(f.path) !== normalized);
        // if closing the active file, switch to last open file or null
        if (currentFile && normalize(currentFile.path) === normalized) {
          const last = next[next.length - 1] ?? null;
          setCurrentFile(last);
        }
        return next;
      });
    },
    [currentFile]
  );

  // Ensure at least one file is open on mount:
  useEffect(() => {
    if (openFiles.length === 0) {
      // if config has a common entry point, open it, else open a tiny default
      const prefer = config?.files?.find((f) =>
        ["app/layout.tsx", "app/page.tsx", "index.tsx"].includes(
          normalize(f.path)
        )
      );
      if (prefer) {
        openFileInEditor(prefer.path);
      } else if (config?.files?.length) {
        openFileInEditor(config.files[0].path);
      } else {
        // fallback default file
        const defaultPath = "app/layout.tsx";
        const defaultContent = `import './globals.css';\nexport default function RootLayout({ children }: { children: React.ReactNode }) { return <html><body>{children}</body></html> }`;
        // temporarily add to openFiles
        const newFile: OpenFile = {
          path: defaultPath,
          name: "layout.tsx",
          content: defaultContent,
          isDirty: false,
        };
        setOpenFiles([newFile]);
        setCurrentFile(newFile);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return (
    <div className="h-screen bg-neutral-950 text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[260px] border-r border-neutral-800 bg-neutral-900 overflow-y-auto">
          {/* pass config & activeFile to tree; tree calls onFileOpen which uses openFileInEditor */}
          <FileTree
            config={config ?? { files: [] }}
            activeFile={currentFile?.path ?? null}
            onFileOpen={(p) => {
              openFileInEditor(p);
            }}
          />
        </div>

        <div className="flex-1 flex flex-col">
          {/* Tabs / breadcrumb area */}
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
