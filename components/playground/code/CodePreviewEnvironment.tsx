"use client";

import React, { useState } from "react";
import { DownloadIcon } from "lucide-react";
import PreviewPane from "./PreviewPane";
import { CodeInterface } from "./CodeInterface";
import { motion } from "framer-motion";

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

// const config: CodeConfig = {
//   project: {
//     name: "todo-app",
//     description: "Minimal Next.js + TypeScript + Tailwind TODO app scaffold",
//     stack: ["nextjs", "typescript", "tailwind"],
//     packageManager: "pnpm",
//   },
//   files: [
//     {
//       path: "package.json",
//       type: "text",
//       language: "json",
//       executable: false,
//       content: `{
//   "name": "todo-app",
//   "version": "0.1.0",
//   "private": true,
//   "scripts": {
//     "dev": "next dev",
//     "build": "next build",
//     "start": "next start",
//     "lint": "next lint"
//   },
//   "dependencies": {
//     "next": "^14.0.0",
//     "react": "^18.2.0",
//     "react-dom": "^18.2.0",
//     "clsx": "^1.2.1"
//   },
//   "devDependencies": {
//     "typescript": "^5.0.0",
//     "tailwindcss": "^3.5.0",
//     "postcss": "^8.4.0",
//     "autoprefixer": "^10.4.0",
//     "eslint": "^8.0.0",
//     "@types/react": "^18.0.0"
//   }
// }
// `,
//     },
//     {
//       path: "tsconfig.json",
//       type: "text",
//       language: "json",
//       executable: false,
//       content: `{
//   "compilerOptions": {
//     "target": "ES2022",
//     "lib": ["DOM", "DOM.Iterable", "ESNext"],
//     "allowJs": false,
//     "skipLibCheck": true,
//     "strict": true,
//     "forceConsistentCasingInFileNames": true,
//     "module": "ESNext",
//     "moduleResolution": "Node",
//     "resolveJsonModule": true,
//     "isolatedModules": true,
//     "noEmit": true,
//     "jsx": "react-jsx"
//   },
//   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
//   "exclude": ["node_modules"]
// }
// `,
//     },
//     {
//       path: "postcss.config.js",
//       type: "text",
//       language: "javascript",
//       executable: false,
//       content: `module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {}
//   }
// };
// `,
//     },
//     {
//       path: "tailwind.config.js",
//       type: "text",
//       language: "javascript",
//       executable: false,
//       content: `module.exports = {
//   content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],
//   theme: { extend: {} },
//   plugins: []
// };
// `,
//     },
//     {
//       path: "README.md",
//       type: "text",
//       language: "markdown",
//       executable: false,
//       content: `# todo-app

// Minimal Next.js + TypeScript + Tailwind TODO app scaffold.

// **Install**
// \`\`\`bash
// pnpm install
// pnpm dev
// \`\`\`
// `,
//     },
//     {
//       path: "app/layout.tsx",
//       type: "text",
//       language: "typescript",
//       executable: false,
//       content: `import './globals.css';
// import React from 'react';
// export const metadata = { title: 'Todo App' };
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         {children}
//       </body>
//     </html>
//   );
// }
// `,
//     },
//     {
//       path: "app/page.tsx",
//       type: "text",
//       language: "typescript",
//       executable: false,
//       content: `import React from 'react';
// import TodoApp from '../components/TodoApp';
// export default function Page() {
//   return (
//     <main className="min-h-screen bg-neutral-900 text-white p-6">
//       <div className="max-w-2xl mx-auto">
//         <h1 className="text-2xl font-semibold mb-4">Todo</h1>
//         <TodoApp />
//       </div>
//     </main>
//   );
// }
// `,
//     },
//     {
//       path: "components/TodoApp.tsx",
//       type: "text",
//       language: "typescript",
//       executable: false,
//       content: `'use client';
// import React, { useState, useEffect } from 'react';
// export default function TodoApp() {
//   const [items, setItems] = useState<{id:string;text:string;done:boolean}[]>(() => {
//     try { return JSON.parse(localStorage.getItem('todos') || '[]'); } catch { return []; }
//   });
//   const [text, setText] = useState('');
//   useEffect(() => { localStorage.setItem('todos', JSON.stringify(items)); }, [items]);
//   const add = () => { if (!text.trim()) return; setItems(s => [...s, { id: Date.now().toString(), text: text.trim(), done: false }]); setText(''); }
//   const toggle = (id:string) => setItems(s => s.map(i => i.id===id?{...i,done:!i.done}:i));
//   const remove = (id:string) => setItems(s => s.filter(i=>i.id!==id));
//   return (
//     <div className="bg-neutral-800 rounded p-4">
//       <div className="flex gap-2 mb-4">
//         <input value={text} onChange={e=>setText(e.target.value)} placeholder="Add todo" className="flex-1 px-3 py-2 rounded bg-neutral-700 outline-none" />
//         <button onClick={add} className="px-3 py-2 bg-indigo-600 rounded">Add</button>
//       </div>
//       <ul className="space-y-2">
//         {items.map(i=> (
//           <li key={i.id} className="flex items-center justify-between bg-neutral-900 px-3 py-2 rounded">
//             <div className="flex items-center gap-3">
//               <input type="checkbox" checked={i.done} onChange={()=>toggle(i.id)} />
//               <span className={i.done? 'line-through text-neutral-500':'text-white'}>{i.text}</span>
//             </div>
//             <button onClick={()=>remove(i.id)} className="text-xs text-neutral-400 hover:text-white">Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// `,
//     },
//     {
//       path: "components/index.ts",
//       type: "text",
//       language: "typescript",
//       executable: false,
//       content: `export { default as TodoApp } from './TodoApp';
// `,
//     },
//     {
//       path: "styles/globals.css",
//       type: "text",
//       language: "css",
//       executable: false,
//       content: `@tailwind base;
// @tailwind components;
// @tailwind utilities;
// html,body,#root{height:100%}
// body{background:#090909}
// `,
//     },
//   ],
//   scripts: {
//     dev: "next dev",
//     build: "next build",
//     start: "next start",
//   },
//   run: {
//     install: "pnpm install",
//     dev: "pnpm dev",
//     build: "pnpm build",
//     start: "pnpm start",
//   },
// };

const config: CodeConfig = {
  "files": [
    {
      "path": "app/todo/page.tsx",
      "type": "text",
      "language": "typescript",
      "executable": false,
      "content": "import { useState } from 'react';\nimport TodoList from '../../components/TodoList';\nimport TodoForm from '../../components/TodoForm';\n\nexport default function TodoPage() {\n  const [todos, setTodos] = useState([]);\n  const [newTodo, setNewTodo] = useState('');\n\n  const handleAddTodo = () => {\n    if (newTodo.trim() !== '') {\n      setTodos([...todos, { text: newTodo, completed: false }]);\n      setNewTodo('');\n    }\n  };\n\n  const handleToggleCompleted = (index: number) => {\n    const newTodos = [...todos];\n    newTodos[index].completed = !newTodos[index].completed;\n    setTodos(newTodos);\n  };\n\n  const handleRemoveTodo = (index: number) => {\n    const newTodos = [...todos];\n    newTodos.splice(index, 1);\n    setTodos(newTodos);\n  };\n\n  return (\n    <div className=\"container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24\">\n      <h1 className=\"text-3xl font-bold mb-4\">Todo List</h1>\n      <TodoForm\n        newTodo={newTodo}\n        setNewTodo={setNewTodo}\n        handleAddTodo={handleAddTodo}\n      />\n      <TodoList\n        todos={todos}\n        handleToggleCompleted={handleToggleCompleted}\n        handleRemoveTodo={handleRemoveTodo}\n      />\n    </div>\n  );\n}"
    },
    {
      "path": "components/TodoList.tsx",
      "type": "text",
      "language": "typescript",
      "executable": false,
      "content": "import { useState } from 'react';\n\ninterface Todo {\n  text: string;\n  completed: boolean;\n}\n\ninterface TodoListProps {\n  todos: Todo[];\n  handleToggleCompleted: (index: number) => void;\n  handleRemoveTodo: (index: number) => void;\n}\n\nexport default function TodoList({ todos, handleToggleCompleted, handleRemoveTodo }: TodoListProps) {\n  return (\n    <ul>\n      {todos.map((todo, index) => (\n        <li\n          key={index}\n          className=\"flex justify-between mb-4 items-center\"\n        >\n          <span\n            className={`text-lg ${todo.completed ? 'line-through' : ''}`}\n            onClick={() => handleToggleCompleted(index)}\n          >\n            {todo.text}\n          </span>\n          <button\n            className=\"bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded\"\n            onClick={() => handleRemoveTodo(index)}\n          >\n            Remove\n          </button>\n        </li>\n      ))}\n    </ul>\n  );\n}"
    },
    {
      "path": "components/TodoForm.tsx",
      "type": "text",
      "language": "typescript",
      "executable": false,
      "content": "import { useState } from 'react';\n\ninterface TodoFormProps {\n  newTodo: string;\n  setNewTodo: (newTodo: string) => void;\n  handleAddTodo: () => void;\n}\n\nexport default function TodoForm({ newTodo, setNewTodo, handleAddTodo }: TodoFormProps) {\n  return (\n    <div className=\"flex justify-between mb-4 items-center\">\n      <input\n        type=\"text\"\n        value={newTodo}\n        onChange={(e) => setNewTodo(e.target.value)}\n        className=\"shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\"\n        placeholder=\"Add new todo\"\n      />\n      <button\n        className=\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded\"\n        onClick={handleAddTodo}\n      >\n        Add\n      </button>\n    </div>\n  );\n}"
    }
  ]
};

const categories = {
  ide: { label: "Code" },
  preview: { label: "Preview" },
};

const NextIDEInterface: React.FC = () => {
  const currentCode = "";
  const [viewMode, setViewMode] = useState<"ide" | "preview">("ide");

  return (
    <div className="h-screen bg-[#1e1e1e] text-white flex flex-col rounded-lg border border-neutral-800 overflow-hidden">
      <div className="bg-[#0F0F10] border-b border-neutral-900 px-4 py-2 flex items-center justify-between">
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
          <CodeInterface {...config} />
        ) : (
          <PreviewPane code={currentCode} fileName={"page.tsx"} />
        )}
      </div>
    </div>
  );
};

export default NextIDEInterface;
