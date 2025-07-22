import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, FolderOpen, Folder } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  isOpen?: boolean;
}

interface FileTreeProps {
  onFileSelect: (path: string, content: string) => void;
  selectedFile: string | null;
}

const fileStructure: FileNode[] = [
  {
    name: 'app',
    type: 'folder',
    path: 'app',
    isOpen: true,
    children: [
      {
        name: 'layout.tsx',
        type: 'file',
        path: 'app/layout.tsx'
      },
      {
        name: 'page.tsx',
        type: 'file',
        path: 'app/page.tsx'
      }
    ]
  },
  {
    name: 'components',
    type: 'folder',
    path: 'components',
    isOpen: true,
    children: [
      {
        name: 'ui',
        type: 'folder',
        path: 'components/ui',
        isOpen: false,
        children: [
          { name: 'toast.tsx', type: 'file', path: 'components/ui/toast.tsx' },
          { name: 'toaster.tsx', type: 'file', path: 'components/ui/toaster.tsx' },
          { name: 'typescript-editor.tsx', type: 'file', path: 'components/ui/typescript-editor.tsx' }
        ]
      }
    ]
  },
  {
    name: 'hooks',
    type: 'folder',
    path: 'hooks',
    isOpen: false,
    children: [
      {
        name: 'use-toast.ts',
        type: 'file',
        path: 'hooks/use-toast.ts'
      }
    ]
  }
];

const fileContents: Record<string, string> = {
  'app/layout.tsx': `import type { Metadata } from "next"
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
}`,
  'app/page.tsx': `export default function Home() {
  return (
    <main>
      <h1>Welcome to TypeScript Editor</h1>
    </main>
  )
}`,
  'components/ui/toast.tsx': `import React from "react"

export interface ToastProps {
  title?: string
  description?: string
}

export const Toast: React.FC<ToastProps> = ({ title, description }) => {
  return (
    <div className="toast">
      {title && <h4>{title}</h4>}
      {description && <p>{description}</p>}
    </div>
  )
}`,
  'components/ui/toaster.tsx': `import { Toast } from "./toast"

export const Toaster = () => {
  return (
    <div className="toaster">
      <Toast title="Success" description="File saved successfully" />
    </div>
  )
}`,
  'components/ui/typescript-editor.tsx': `import { useState } from "react"
import Editor from "@monaco-editor/react"

export const TypeScriptEditor = () => {
  const [code, setCode] = useState("")
  
  return (
    <Editor
      height="400px"
      defaultLanguage="typescript"
      value={code}
      onChange={(value) => setCode(value || "")}
    />
  )
}`,
  'hooks/use-toast.ts': `import { useState } from "react"

interface Toast {
  id: string
  title?: string
  description?: string
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])
  
  const toast = ({ title, description }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36)
    setToasts(prev => [...prev, { id, title, description }])
  }
  
  return { toast, toasts }
}`
};

export const FileTree: React.FC<FileTreeProps> = ({ onFileSelect, selectedFile }) => {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['app', 'components']));

  const toggleFolder = (path: string) => {
    setOpenFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleFileClick = (path: string) => {
    const content = fileContents[path] || '';
    onFileSelect(path, content);
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isOpen = openFolders.has(node.path);
    const isSelected = selectedFile === node.path;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center py-1 px-2 text-sm cursor-pointer hover:bg-vscode-hover ${
            isSelected ? 'bg-vscode-selected' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              handleFileClick(node.path);
            }
          }}
        >
          {node.type === 'folder' && (
            <>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 mr-1 text-vscode-text-muted" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1 text-vscode-text-muted" />
              )}
              {isOpen ? (
                <FolderOpen className="w-4 h-4 mr-2 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 mr-2 text-blue-400" />
              )}
            </>
          )}
          {node.type === 'file' && (
            <>
              <span className="w-4 mr-1"></span>
              <File className="w-4 h-4 mr-2 text-vscode-text-muted" />
            </>
          )}
          <span className="text-vscode-text">{node.name}</span>
          {node.type === 'file' && node.path === 'app/layout.tsx' && (
            <span className="ml-auto text-green-400 text-xs">+28</span>
          )}
          {node.type === 'file' && node.path === 'app/page.tsx' && (
            <span className="ml-auto text-green-400 text-xs">+6</span>
          )}
          {node.type === 'file' && node.path === 'components/ui/toast.tsx' && (
            <span className="ml-auto text-green-400 text-xs">+112</span>
          )}
          {node.type === 'file' && node.path === 'components/ui/toaster.tsx' && (
            <span className="ml-auto text-green-400 text-xs">+25</span>
          )}
          {node.type === 'file' && node.path === 'components/ui/typescript-editor.tsx' && (
            <span className="ml-auto text-green-400 text-xs">+314</span>
          )}
          {node.type === 'file' && node.path === 'hooks/use-toast.ts' && (
            <span className="ml-auto text-green-400 text-xs">+187</span>
          )}
        </div>
        {node.type === 'folder' && isOpen && node.children && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 bg-neutral-950 border-r border-neutral-800 h-full overflow-y-auto">
      <div className="py-2">
        {fileStructure.map(node => renderNode(node))}
      </div>
    </div>
  );
};