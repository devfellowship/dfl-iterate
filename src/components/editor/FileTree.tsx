import { useState } from 'react';
import { ChevronRight, ChevronDown, FileCode, Folder, FolderOpen } from 'lucide-react';
import { ProjectFile } from '@/types';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  files: ProjectFile[];
  onFileSelect: (file: ProjectFile) => void;
  selectedFile?: string;
}

interface TreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children: TreeNode[];
  file?: ProjectFile;
}

function buildTree(files: ProjectFile[]): TreeNode[] {
  const root: TreeNode[] = [];
  const pathMap = new Map<string, TreeNode>();

  // Sort files by path
  const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

  sortedFiles.forEach(file => {
    const parts = file.path.split('/');
    let currentPath = '';

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!pathMap.has(currentPath)) {
        const node: TreeNode = {
          name: part,
          path: currentPath,
          isDirectory: !isLast,
          children: [],
          file: isLast ? file : undefined,
        };

        pathMap.set(currentPath, node);

        if (parentPath) {
          const parent = pathMap.get(parentPath);
          if (parent) {
            parent.children.push(node);
          }
        } else {
          root.push(node);
        }
      }
    });
  });

  return root;
}

export function FileTree({ files, onFileSelect, selectedFile }: FileTreeProps) {
  const tree = buildTree(files);

  return (
    <div className="text-sm">
      {tree.map(node => (
        <TreeNodeComponent
          key={node.path}
          node={node}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
          depth={0}
        />
      ))}
    </div>
  );
}

interface TreeNodeComponentProps {
  node: TreeNode;
  onFileSelect: (file: ProjectFile) => void;
  selectedFile?: string;
  depth: number;
}

function TreeNodeComponent({ node, onFileSelect, selectedFile, depth }: TreeNodeComponentProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = node.file?.path === selectedFile;

  if (node.isDirectory) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1.5 w-full px-2 py-1 hover:bg-muted/50 rounded text-left",
            "text-muted-foreground hover:text-foreground transition-colors"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          )}
          {isOpen ? (
            <FolderOpen className="w-4 h-4 text-primary shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-primary shrink-0" />
          )}
          <span>{node.name}</span>
        </button>
        {isOpen && node.children.length > 0 && (
          <div>
            {node.children.map(child => (
              <TreeNodeComponent
                key={child.path}
                node={child}
                onFileSelect={onFileSelect}
                selectedFile={selectedFile}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => node.file && onFileSelect(node.file)}
      className={cn(
        "flex items-center gap-1.5 w-full px-2 py-1 rounded text-left transition-colors",
        isSelected
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
      style={{ paddingLeft: `${depth * 12 + 24}px` }}
    >
      <FileCode className="w-4 h-4 shrink-0" />
      <span className="truncate">{node.name}</span>
    </button>
  );
}
