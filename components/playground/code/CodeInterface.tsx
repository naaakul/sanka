import React, { useState } from "react";
import { FileTree } from "./FileTree";
import { EditorBreadcrumb } from "./EditorTabs";
import { MonacoEditor } from "./MonacoEditor";

interface OpenFile {
  path: string;
  name: string;
  content: string;
  isDirty: boolean;
}

export const VSCodeInterface: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<OpenFile | null>(null);

  const handleFileSelect = (path: string, content: string) => {
    const fileName = path.split("/").pop() || path;

    if (currentFile?.path === path) {
      return;
    }

    setCurrentFile({
      path,
      name: fileName,
      content,
      isDirty: false,
    });
  };

  const handleClose = () => {
    setCurrentFile(null);
  };

  const handleContentChange = (content: string) => {
    if (!currentFile) return;

    setCurrentFile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        content,
        isDirty: true,
      };
    });
  };

  React.useEffect(() => {
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
  }, [currentFile, handleFileSelect]);

  return (
    <div className="h-screen bg-neutral-950 text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <FileTree
          onFileSelect={handleFileSelect}
          selectedFile={currentFile?.path ?? null}
        />

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
                  <h2 className="text-2xl mb-4">Welcome to CODE-SHAKE</h2>
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
