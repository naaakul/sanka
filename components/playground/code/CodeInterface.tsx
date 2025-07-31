import React, { useState, useEffect } from "react";
import { EditorBreadcrumb } from "./EditorTabs";
import { MonacoEditor } from "./MonacoEditor";
import FileTree from "./FileTree";

interface OpenFile {
  path: string;
  name: string;
  content: string;
  isDirty: boolean;
}

export const CodeInterface: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<OpenFile | null>(null);

  const handleFileSelect = (path: string, content: string) => {
    const fileName = path.split("/").pop() || path;

    if (currentFile?.path === path) return;

    setCurrentFile({
      path,
      name: fileName,
      content,
      isDirty: false,
    });
  };

  const handleClose = () => setCurrentFile(null);

  const handleContentChange = (content: string) => {
    if (!currentFile) return;

    setCurrentFile((prev) => prev ? { ...prev, content, isDirty: true } : prev);
  };

  useEffect(() => {
    if (!currentFile) {
      const defaultContent = `import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TypeScript Code Editor",
  description: "A powerful TypeScript code editor with Monaco Editor",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}`;
      handleFileSelect("app/layout.tsx", defaultContent);
    }
  }, [currentFile]);

  return (
    <div className="h-screen bg-neutral-950 text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[260px] border-r border-neutral-800 bg-neutral-900 overflow-y-auto">
          <FileTree />
        </div>

        <div className="flex-1 flex flex-col">
          {currentFile && (
            <EditorBreadcrumb
              path={currentFile.path}
              isDirty={currentFile.isDirty}
              onClose={handleClose}
            />
          )}

          <div className="flex-1">
            {currentFile ? (
              <MonacoEditor
                value={currentFile.content}
                onChange={handleContentChange}
                language="typescript"
                fileName={currentFile.name}
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
