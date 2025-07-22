import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'; 

interface EditorBreadcrumbProps {
  path: string;
  isDirty: boolean;
  onClose: () => void;
}

export const EditorBreadcrumb: React.FC<EditorBreadcrumbProps> = ({
  path,
}) => {
  const parts = path.split('/').filter(part => part.trim() !== '');

  return (
    <Breadcrumb className="border-b border-neutral-800 overflow-x-auto p-2">
      <BreadcrumbList>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator/>}
            <BreadcrumbItem
              className={`${
                index === parts.length - 1
                  ? 'bg-vscode-tab-active text-vscode-text'
                  : 'text-vscode-text-muted hover:bg-vscode-hover'
              } py-1 rounded`}
            >
              {index === parts.length - 1 ? (
                <div className="flex items-center">
                  <span className="text-sm font-medium truncate text-white">{part}</span>
                </div>
              ) : (
                <span className="text-sm font-medium">{part}</span>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};