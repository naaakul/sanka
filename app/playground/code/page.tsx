"use client";

import Chat from "@/components/playground/Chat";
import NextIDEInterface from "@/components/playground/code/CodePreviewEnvironment";
import PlaygroundNavbar from "@/components/playground/PlaygroundNavbar";
import { PlaygroundPanels } from "@/components/playground/PlaygroundPanels";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// import { Suspense } from "react";
import { ChatSession, CodeConfig, CodeFile } from "@/lib/types/codeChat.types";
import Sidebar from "@/components/playground/Sidebar";
import { useSession } from "@/lib/auth/auth-client";

// const co = {
//   files: [
//     {
//       path: "app/page.tsx",
//       content: `"use client"
// import { useState } from 'react';
// import TodoList from '../components/TodoList';
// import TodoForm from '../components/TodoForm';

// export default function TodoPage() {
//   const [todos, setTodos] = useState([]);
//   const [newTodo, setNewTodo] = useState('');

//   const handleAddTodo = () => {
//     if (newTodo.trim() !== '') {
//       setTodos([...todos, { text: newTodo, completed: false }]);
//       setNewTodo('');
//     }
//   };

//   const handleToggleCompleted = (index: number) => {
//     const newTodos = [...todos];
//     newTodos[index].completed = !newTodos[index].completed;
//     setTodos(newTodos);
//   };

//   const handleRemoveTodo = (index: number) => {
//     const newTodos = [...todos];
//     newTodos.splice(index, 1);
//     setTodos(newTodos);
//   };

//   return (
//     <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
//       <h1 className="text-3xl font-bold mb-4">Todo List</h1>
//       <TodoForm
//         newTodo={newTodo}
//         setNewTodo={setNewTodo}
//         handleAddTodo={handleAddTodo}
//       />
//       <TodoList
//         todos={todos}
//         handleToggleCompleted={handleToggleCompleted}
//         handleRemoveTodo={handleRemoveTodo}
//       />
//     </div>
//   );
// }`,
//     },
//     {
//       path: "components/TodoList.tsx",
//       content: `interface Todo {
//   text: string;
//   completed: boolean;
// }

// interface TodoListProps {
//   todos: Todo[];
//   handleToggleCompleted: (index: number) => void;
//   handleRemoveTodo: (index: number) => void;
// }

// export default function TodoList({ todos, handleToggleCompleted, handleRemoveTodo }: TodoListProps) {
//   return (
//     <ul>
//       {todos.map((todo, index) => (
//         <li key={index} className="flex justify-between mb-4 items-center">
//           <span
//             className={\`text-lg \${todo.completed ? 'line-through' : ''}\`}
//             onClick={() => handleToggleCompleted(index)}
//           >
//             {todo.text}
//           </span>
//           <button
//             className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//             onClick={() => handleRemoveTodo(index)}
//           >
//             Remove
//           </button>
//         </li>
//       ))}
//     </ul>
//   );
// }`,
//     },
//     {
//       path: "components/TodoForm.tsx",
//       content: `interface TodoFormProps {
//   newTodo: string;
//   setNewTodo: (newTodo: string) => void;
//   handleAddTodo: () => void;
// }

// export default function TodoForm({ newTodo, setNewTodo, handleAddTodo }: TodoFormProps) {
//   return (
//     <div className="flex justify-between mb-4 items-center">
//       <input
//         type="text"
//         value={newTodo}
//         onChange={(e) => setNewTodo(e.target.value)}
//         className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         placeholder="Add new todo"
//       />
//       <button
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         onClick={handleAddTodo}
//       >
//         Add
//       </button>
//     </div>
//   );
// }`,
//     },
//   ],
// };

const Page = () => {
  // const { data: session } = useSession();
  const [sessions, setSessions] = useState([]);
  const [chatSession, setChatSession] = useState<ChatSession>();
  const [config, setConfig] = useState<CodeConfig | null>(null);
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState<string | null>(searchParams.get("q"));
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const res = await fetch("/api/chat-sessions");
      if (!res.ok) return;
      const data = await res.json();
      // console.log("got dataaaaaaa---------> ", data);
      setSessions(data);
    };
    fetchSessions();
  }, []);

  function handleEnter() {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  }

  function handleLeave() {
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 120);
  }

  useEffect(() => {
    if (!prompt) return;

    const generateCode = async () => {
      try {
        const res = await fetch("/api/generate/code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        const data: { files: CodeFile[]; botMessages: string } =
          await res.json();

        console.log("data :->", data);
        setConfig({ files: data.files });

        setChatSession((prev) => ({
          turns: [
            ...(prev?.turns ?? []),
            {
              user: [prompt],
              bot: {
                messages: data.botMessages,
                code: data.files,
              },
            },
          ],
        }));
      } catch (err) {
        console.error(err);
      }
    };

    generateCode();
  }, [prompt]);

  return (
    // <Suspense>
    <div className="h-screen flex flex-col">
      <Sidebar
        sessions={sessions}
        open={open}
        handleEnter={handleEnter}
        handleLeave={handleLeave}
      />
      <PlaygroundNavbar handleEnter={handleEnter} handleLeave={handleLeave} />
      <PlaygroundPanels
        leftPanel={
          <div className="pl-2 pb-2 h-full">
            <Chat
              chatSession={chatSession ?? { turns: [] }}
              setPrompt={setPrompt}
              useSession={useSession}
            />
          </div>
        }
        rightPanel={
          <div className="pr-2 pb-2 h-full">
            <NextIDEInterface config={config || { files: [] }} />
          </div>
        }
        defaultLeftWidth={50}
        minLeftWidth={30}
        maxLeftWidth={60}
      />
    </div>
    // </Suspense>
  );
};

export default Page;
