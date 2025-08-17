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
  project: {
    name: string;
    description: string;
    stack: string[];
    packageManager: "npm" | "pnpm" | "yarn" | string;
  };
  files: {
    path: string;
    type: "text" | "binary";
    language: string;
    executable: boolean;
    content: string;
  }[];
  scripts: {
    dev: string;
    build: string;
    start: string;
    [key: string]: string;
  };
  run: {
    install: string;
    dev: string;
    build: string;
    start: string;
    [key: string]: string;
  };
}

const config: CodeConfig = {
  project: {
    name: "todo-app",
    description: "Minimal Next.js + TypeScript + Tailwind TODO app scaffold",
    stack: ["nextjs", "typescript", "tailwind"],
    packageManager: "pnpm",
  },
  files: [
    {
      path: "package.json",
      type: "text",
      language: "json",
      executable: false,
      content:
        '{\n  "name": "todo-app",\n  "version": "0.1.0",\n  "private": true,\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start",\n    "lint": "next lint"\n  },\n  "dependencies": {\n    "next": "^14.0.0",\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "clsx": "^1.2.1"\n  },\n  "devDependencies": {\n    "typescript": "^5.0.0",\n    "tailwindcss": "^3.5.0",\n    "postcss": "^8.4.0",\n    "autoprefixer": "^10.4.0",\n    "eslint": "^8.0.0",\n    "@types/react": "^18.0.0"\n  }\n}\n',
    },
    {
      path: "tsconfig.json",
      type: "text",
      language: "json",
      executable: false,
      content:
        '{\n  "compilerOptions": {\n    "target": "ES2022",\n    "lib": ["DOM", "DOM.Iterable", "ESNext"],\n    "allowJs": false,\n    "skipLibCheck": true,\n    "strict": true,\n    "forceConsistentCasingInFileNames": true,\n    "module": "ESNext",\n    "moduleResolution": "Node",\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "noEmit": true,\n    "jsx": "react-jsx"\n  },\n  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],\n  "exclude": ["node_modules"]\n}\n',
    },
    {
      path: "postcss.config.js",
      type: "text",
      language: "javascript",
      executable: false,
      content:
        "module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {}\n  }\n};\n",
    },
    {
      path: "tailwind.config.js",
      type: "text",
      language: "javascript",
      executable: false,
      content:
        'module.exports = {\n  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],\n  theme: { extend: {} },\n  plugins: []\n};\n',
    },
    {
      path: "README.md",
      type: "text",
      language: "markdown",
      executable: false,
      content:
        "# todo-app\\n\\nMinimal Next.js + TypeScript + Tailwind TODO app scaffold.\\n\\n**Install**\\n```bash\\npnpm install\\npnpm dev\\n```\\n",
    },
    {
      path: "app/layout.tsx",
      type: "text",
      language: "typescript",
      executable: false,
      content:
        "import './globals.css';\\nimport React from 'react';\\nexport const metadata = { title: 'Todo App' };\\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\\n  return (\\n    <html lang=\"en\">\\n      <body>\\n        {children}\\n      </body>\\n    </html>\\n  );\\n}\\n",
    },
    {
      path: "app/page.tsx",
      type: "text",
      language: "typescript",
      executable: false,
      content:
        'import React from \'react\';\\nimport TodoApp from \'../components/TodoApp\';\\nexport default function Page() {\\n  return (\\n    <main className="min-h-screen bg-neutral-900 text-white p-6">\\n      <div className="max-w-2xl mx-auto">\\n        <h1 className="text-2xl font-semibold mb-4">Todo</h1>\\n        <TodoApp />\\n      </div>\\n    </main>\\n  );\\n}\\n',
    },
    {
      path: "components/TodoApp.tsx",
      type: "text",
      language: "typescript",
      executable: false,
      content:
        'use client\';\\nimport React, { useState, useEffect } from \'react\';\\nexport default function TodoApp() {\\n  const [items, setItems] = useState<{id:string;text:string;done:boolean}[]>(() => {\\n    try { return JSON.parse(localStorage.getItem(\'todos\') || \'[]\'); } catch { return []; }\\n  });\\n  const [text, setText] = useState(\'\');\\n  useEffect(() => { localStorage.setItem(\'todos\', JSON.stringify(items)); }, [items]);\\n  const add = () => { if (!text.trim()) return; setItems(s => [...s, { id: Date.now().toString(), text: text.trim(), done: false }]); setText(\'\'); }\\n  const toggle = (id:string) => setItems(s => s.map(i => i.id===id?{...i,done:!i.done}:i));\\n  const remove = (id:string) => setItems(s => s.filter(i=>i.id!==id));\\n  return (\\n    <div className="bg-neutral-800 rounded p-4">\\n      <div className="flex gap-2 mb-4">\\n        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Add todo" className="flex-1 px-3 py-2 rounded bg-neutral-700 outline-none" />\\n        <button onClick={add} className="px-3 py-2 bg-indigo-600 rounded">Add</button>\\n      </div>\\n      <ul className="space-y-2">\\n        {items.map(i=> (\\n          <li key={i.id} className="flex items-center justify-between bg-neutral-900 px-3 py-2 rounded">\\n            <div className="flex items-center gap-3">\\n              <input type="checkbox" checked={i.done} onChange={()=>toggle(i.id)} />\\n              <span className={i.done? \'line-through text-neutral-500\':\'text-white\'}>{i.text}</span>\\n            </div>\\n            <button onClick={()=>remove(i.id)} className="text-xs text-neutral-400 hover:text-white">Delete</button>\\n          </li>\\n        ))}\\n      </ul>\\n    </div>\\n  );\\n}\\n',
    },
    {
      path: "components/index.ts",
      type: "text",
      language: "typescript",
      executable: false,
      content: "export { default as TodoApp } from './TodoApp';\\n",
    },
    {
      path: "styles/globals.css",
      type: "text",
      language: "css",
      executable: false,
      content:
        "@tailwind base;\\n@tailwind components;\\n@tailwind utilities;\\nhtml,body,#root{height:100%}\\nbody{background:#090909}\n",
    },
  ],
  scripts: {
    dev: "next dev",
    build: "next build",
    start: "next start",
  },
  run: {
    install: "pnpm install",
    dev: "pnpm dev",
    build: "pnpm build",
    start: "pnpm start",
  },
};

export const CodeInterface = () => {
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
      prev && normalize(prev.path) === normalized ? { ...prev, content, isDirty: true } : prev
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
        ["app/layout.tsx", "app/page.tsx", "index.tsx"].includes(normalize(f.path))
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
                onContentChange={(path, content) => handleContentChange(path, content)}
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
