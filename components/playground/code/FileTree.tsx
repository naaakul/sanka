"use client";

import React, { useMemo } from "react";
import {
  hotkeysCoreFeature,
  syncDataLoaderFeature,
  selectionFeature,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";

import { Tree, TreeItem, TreeItemLabel } from "./tree";

type FileSpec = {
  path: string;
  content?: string;
  // other fields from your config file are allowed but ignored here
};

type Config = {
  files: FileSpec[];
  // other top-level metadata allowed but ignored here
};

interface ItemData {
  name: string;
  // children are IDs (string) of child items
  children?: string[];
  // keep original fullPath for files so callbacks can use it
  fullPath?: string;
}

interface FileTreeProps {
  config: Config;
  /**
   * activeFile should be exact path string e.g. "app/layout.tsx"
   * this will be used to highlight the open file in the explorer
   */
  activeFile?: string | null;
  /**
   * called when user clicks a file in the tree
   */
  onFileOpen?: (path: string) => void;
}

const indent = 20;
const ROOT_ID = "root";

function getLastSegment(id: string) {
  const parts = id.split("/");
  return parts[parts.length - 1];
}

/**
 * Build an items map for headless-tree from the files list.
 *
 * Items keys are string IDs that correspond to folder paths and file full paths.
 * Example IDs produced:
 * - "app"
 * - "app/components"
 * - "app/components/Button.tsx"
 *
 * Root is `ROOT_ID` and top-level folders/files are children of root.
 */
function buildItemsFromConfig(config: Config): Record<string, ItemData> {
  const map: Record<string, ItemData> = {};

  // ensure root exists
  map[ROOT_ID] = { name: "/", children: [] };

  const files = config.files ?? [];

  // For each file path, create intermediate folder nodes
  for (const file of files) {
    const normalized = file.path.replace(/^\/+/, ""); // strip leading slash if any
    const segments = normalized.split("/").filter(Boolean);

    // Walk segments and create nodes
    let prefixParts: string[] = [];
    for (let i = 0; i < segments.length; i++) {
      prefixParts.push(segments[i]);
      const id = prefixParts.join("/"); // folder or file id

      const isLeaf = i === segments.length - 1;
      // ensure the node exists
      if (!map[id]) {
        map[id] = {
          name: segments[i],
          children: isLeaf ? undefined : [],
          fullPath: isLeaf ? normalized : undefined,
        };
      } else {
        // If exists and earlier marked as leaf, convert properly (shouldn't normally happen)
        if (isLeaf) {
          map[id].fullPath = normalized;
          if (map[id].children && map[id].children.length === 0) {
            // keep as file (no children)
            map[id].children = undefined;
          }
        }
      }

      // connect parent -> child
      const parentId = prefixParts.slice(0, -1).join("/") || ROOT_ID;
      if (!map[parentId]) {
        // create parent if missing
        map[parentId] = { name: parentId === ROOT_ID ? "/" : prefixParts.slice(0, -1).slice(-1)[0] || "/", children: [] };
      }
      if (!map[parentId].children) map[parentId].children = [];
      if (!map[parentId].children!.includes(id)) {
        map[parentId].children!.push(id);
      }
    }
  }

  return map;
}

/**
 * Computes the set of folder IDs that should be expanded:
 * includes every ancestor folder of the activeFile so that active file is visible.
 */
function computeExpandedItems(map: Record<string, ItemData>, activeFile?: string | null) {
  if (!activeFile) {
    // If no active file, expand nothing (or you can choose defaults)
    return [];
  }
  const parts = activeFile.split("/").filter(Boolean);
  const expanded: string[] = [];
  for (let i = 0; i < parts.length - 1; i++) {
    const id = parts.slice(0, i + 1).join("/");
    if (map[id]) expanded.push(id);
  }
  return expanded;
}

export default function FileTree({ config, activeFile = null, onFileOpen }: FileTreeProps) {
  const items = useMemo(() => buildItemsFromConfig(config), [config]);

  // compute expanded items from activeFile so the open file is visible
  const expandedItems = useMemo(() => computeExpandedItems(items, activeFile), [items, activeFile]);

  const tree = useTree<ItemData>({
    indent,
    rootItemId: ROOT_ID,
    initialState: {
      expandedItems,
      // optionally set selected item if present and selectionFeature used
      // selectedItems: activeFile ? [activeFile] : [],
    },
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId]?.children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature, selectionFeature],
  });

  return (
    <div className="flex h-full flex-col gap-2 *:first:grow">
      <div>
        <Tree
          className="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
          indent={indent}
          tree={tree}
        >
          {tree.getItems().map((item) => {
            // item id equals node path (or ROOT_ID)
            const id = item.getId();
            const isFolder = item.isFolder();
            const name = item.getItemName();
            const isActive = activeFile && id === activeFile;
            // Last segment for display
            const label = id === ROOT_ID ? "/" : getLastSegment(id);

            return (
              <TreeItem key={id} item={item}>
                <TreeItemLabel
                  // visually indicate active file
                  className={`before:bg-neutral-900 relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 ${
                    isActive ? "bg-neutral-800 text-white" : "text-muted-foreground"
                  }`}
                  // Prevent renaming/select default behaviours
                  onClick={(e: React.MouseEvent) => {
                    // Clicking label should open files only (not folders)
                    if (!isFolder) {
                      e.stopPropagation();
                      onFileOpen?.(id);
                      // mark the item selected in the tree (if supported by selectionFeature)
                      try {
                        // item.select() exists on item API in many headless-tree builds
                        // if not available, it's safe to ignore
                        // @ts-ignore
                        if (typeof item.select === "function") item.select();
                      } catch {}
                    }
                  }}
                >
                  <span className="flex items-center gap-2">
                    {isFolder ? (
                      item.isExpanded() ? (
                        <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
                      ) : (
                        <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
                      )
                    ) : (
                      <FileIcon className="text-muted-foreground pointer-events-none size-4" />
                    )}
                    <span className="truncate">{label}</span>
                    {/* file marker */}
                    {!isFolder && activeFile === id && (
                      <span className="ml-2 text-xs text-neutral-400">open</span>
                    )}
                  </span>
                </TreeItemLabel>
              </TreeItem>
            );
          })}
        </Tree>
      </div>

      <p aria-live="polite" role="region" className="text-muted-foreground mt-2 text-xs">
        Explorer generated from config ∙{" "}
        <a
          href="https://headless-tree.lukasbach.com"
          className="hover:text-foreground underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          API
        </a>
      </p>
    </div>
  );
}
