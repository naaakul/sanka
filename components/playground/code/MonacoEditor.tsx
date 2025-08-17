"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

type FileSpec = { path: string; content?: string };
type Config = { files?: FileSpec[] };

interface MonacoEditorProps {
  config: Config;
  activeFile?: string | null;
  onFileOpen?: (path: string) => void;
  onContentChange?: (path: string, content: string) => void;
}

const PLACEHOLDER_ID = "file:///__no-file-open__";

const getLanguageFromFileName = (fileName: string): string => {
  if (!fileName) return "typescript";
  if (fileName.endsWith(".tsx") || fileName.endsWith(".jsx")) return "typescript";
  if (fileName.endsWith(".ts")) return "typescript";
  if (fileName.endsWith(".js")) return "javascript";
  if (fileName.endsWith(".css")) return "css";
  if (fileName.endsWith(".html")) return "html";
  if (fileName.endsWith(".json")) return "json";
  return "typescript";
};

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  config,
  activeFile = null,
  onContentChange,
}) => {
  const editorRef = useRef<any | null>(null);
  const monacoRef = useRef<any | null>(null); // will hold the `monaco` module instance from onMount
  const changeListenerRef = useRef<any | null>(null);
  const [isReady, setIsReady] = useState(false);

  const createThemeAndTypes = (monacoInstance: any) => {
    monacoInstance.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "F472B6" },
        { token: "identifier", foreground: "E1E4E8" },
        { token: "variable", foreground: "79B8FF" },
        { token: "support.function", foreground: "C084FC" },
        { token: "entity.name.function", foreground: "C084FC" },
        { token: "string", foreground: "4ADE80" },
        { token: "comment", foreground: "5C6370", fontStyle: "italic" },
        { token: "number", foreground: "D19A66" },
        { token: "operator", foreground: "F472B6" },
        { token: "type", foreground: "E5C07B" },
        { token: "delimiter", foreground: "E1E4E8" },
        { token: "constant", foreground: "D19A66" },
        { token: "property", foreground: "C084FC" },
        { token: "parameter", foreground: "FFAB70" },
        { token: "tag", foreground: "4ADE80" },
      ],
      colors: {
        "editor.background": "#0F0F10",
      },
    });

    monacoInstance.editor.setTheme("custom-dark");

    // TypeScript defaults
    try {
      monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monacoInstance.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution: monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monacoInstance.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monacoInstance.languages.typescript.JsxEmit.React,
        reactNamespace: "React",
        allowJs: true,
        typeRoots: ["node_modules/@types"],
      });

      monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      const reactTypes = `declare module 'react' {
  export interface Component<P = {}, S = {}> {}
  export interface ReactNode {}
  export interface ReactElement {}
  export function createElement(type: any, props?: any, ...children: any[]): ReactElement;
  export const useState: <T>(initial: T) => [T, (value: T) => void];
  export const useEffect: (effect: () => void | (() => void), deps?: any[]) => void;
  export const FC: <P = {}>(props: P) => ReactElement | null;
}`;
      monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
        reactTypes,
        "file:///node_modules/@types/react/index.d.ts"
      );

      const nextTypes = `declare module 'next' {
  export interface Metadata { title?: string; description?: string; }
}
declare module 'next/font/google' {
  export function Inter(options: { subsets: string[] }): { className: string };
}`;
      monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
        nextTypes,
        "file:///node_modules/@types/next/index.d.ts"
      );
    } catch (err) {
      // If language APIs aren't present, ignore gracefully
      // (some minimal Monaco builds may not expose `typescript` etc)
      // console.warn("monaco language setup skipped", err);
    }
  };

  const ensureModelsForConfig = (monacoInstance: any) => {
    if (!monacoInstance) return;
    if (!monacoInstance.editor.getModel(monacoInstance.Uri.parse(PLACEHOLDER_ID))) {
      monacoInstance.editor.createModel(
        "// No file open. Select a file in the explorer to begin.\n",
        "text",
        monacoInstance.Uri.parse(PLACEHOLDER_ID)
      );
    }

    for (const file of config?.files ?? []) {
      const normalized = file.path.replace(/^\/+/, "");
      const uri = monacoInstance.Uri.parse(`file:///${normalized}`);
      const language = getLanguageFromFileName(normalized);
      let model = monacoInstance.editor.getModel(uri);
      if (!model) {
        model = monacoInstance.editor.createModel(file.content ?? "", language, uri);
      } else {
        if (model.getValue() !== (file.content ?? "")) {
          model.setValue(file.content ?? "");
        }
      }
    }
  };

  const attachChangeListener = (editor: any) => {
    changeListenerRef.current?.dispose?.();
    changeListenerRef.current = editor.onDidChangeModelContent(() => {
      const model = editor.getModel();
      if (!model) return;
      const uriStr = model.uri.toString();
      if (!uriStr || uriStr === PLACEHOLDER_ID) return;
      const path = uriStr.replace(/^file:\/\//, "").replace(/^\/+/, "");
      const content = model.getValue();
      onContentChange?.(path, content);
    });
  };

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance; // SAVE monaco module instance
    createThemeAndTypes(monacoInstance);
    ensureModelsForConfig(monacoInstance);

    // set initial model based on activeFile
    const targetUri = activeFile ? monacoInstance.Uri.parse(`file:///${activeFile.replace(/^\/+/, "")}`) : monacoInstance.Uri.parse(PLACEHOLDER_ID);
    const modelToUse = monacoInstance.editor.getModel(targetUri) || monacoInstance.editor.getModel(monacoInstance.Uri.parse(PLACEHOLDER_ID));
    if (modelToUse) editor.setModel(modelToUse);

    attachChangeListener(editor);
    setIsReady(true);
  };

  // When config changes (after monaco ready) sync models
  useEffect(() => {
    if (!isReady || !monacoRef.current) return;
    ensureModelsForConfig(monacoRef.current);
    // switch model if needed when activeFile changed (handled in separate effect)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, isReady]);

  // Switch model when activeFile changes
  useEffect(() => {
    if (!isReady || !editorRef.current || !monacoRef.current) return;
    const mon = monacoRef.current;
    const targetUri = activeFile ? mon.Uri.parse(`file:///${activeFile.replace(/^\/+/, "")}`) : mon.Uri.parse(PLACEHOLDER_ID);
    const model = mon.editor.getModel(targetUri) || mon.editor.getModel(mon.Uri.parse(PLACEHOLDER_ID));
    if (model && editorRef.current.getModel() !== model) {
      editorRef.current.setModel(model);
      attachChangeListener(editorRef.current);
      try {
        editorRef.current.revealPositionInCenter({ lineNumber: 1, column: 1 });
        editorRef.current.setPosition({ lineNumber: 1, column: 1 });
      } catch {}
    }
  }, [activeFile, isReady]);

  useEffect(() => {
    return () => {
      changeListenerRef.current?.dispose?.();
      // optional: dispose models if needed
    };
  }, []);

  return (
    <div className="h-full" style={{ backgroundColor: "#21222C" }}>
      <Editor
        height="100%"
        language={activeFile ? getLanguageFromFileName(activeFile) : "text"}
        value={undefined}
        onMount={handleEditorDidMount}
        theme="custom-dark"
        options={{
          fontSize: 14,
          fontFamily: 'Consolas, "Courier New", monospace',
          minimap: { enabled: true },
          lineNumbers: "on",
          renderWhitespace: "selection",
          tabSize: 2,
          insertSpaces: true,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "blink",
          cursorSmoothCaretAnimation: "on",
          renderLineHighlight: "line",
          selectionHighlight: true,
          matchBrackets: "always",
          folding: true,
          foldingStrategy: "indentation",
          showFoldingControls: "mouseover",
          unfoldOnClickAfterEndOfLine: false,
          contextmenu: true,
          mouseWheelZoom: true,
          quickSuggestions: { other: true, comments: false, strings: false },
          parameterHints: { enabled: true },
          suggest: { showKeywords: true, showSnippets: true },
        }}
      />
    </div>
  );
};

export default MonacoEditor;
