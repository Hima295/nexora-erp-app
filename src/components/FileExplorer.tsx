import React, { useState } from 'react';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown, Search, FolderTree, Code, Database, Globe, Container } from 'lucide-react';
import { FileNode, LanguageMode } from '../types';

interface FileExplorerProps {
  tree: FileNode[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
  lang: LanguageMode;
}

const TreeNode: React.FC<{
  node: FileNode;
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
  searchQuery: string;
}> = ({ node, selectedFile, onSelectFile, searchQuery }) => {
  const [isOpen, setIsOpen] = useState(true);

  const isDirectory = node.type === 'directory';
  const isSelected = selectedFile === node.path;

  // Filter check
  if (searchQuery) {
    const matchesSelf = node.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChild = isDirectory && node.children?.some(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.type === 'directory' && c.children?.some(cc => cc.name.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    if (!matchesSelf && !matchesChild) return null;
  }

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.py')) return <FileText className="w-4 h-4 text-emerald-400" />;
    if (filename.endsWith('.json')) return <Database className="w-4 h-4 text-amber-400" />;
    if (filename.endsWith('.js')) return <Code className="w-4 h-4 text-yellow-400" />;
    if (filename.endsWith('.css')) return <Code className="w-4 h-4 text-sky-400" />;
    if (filename.endsWith('.md')) return <FileText className="w-4 h-4 text-blue-400" />;
    if (filename.includes('Docker') || filename.includes('compose')) return <Container className="w-4 h-4 text-indigo-400" />;
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="select-none text-xs">
      <div
        onClick={() => {
          if (isDirectory) {
            setIsOpen(!isOpen);
          } else {
            onSelectFile(node.path);
          }
        }}
        className={`flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
          isSelected 
            ? 'bg-blue-600 text-white font-medium' 
            : 'hover:bg-slate-800/80 text-slate-300'
        }`}
      >
        {isDirectory ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 rtl:rotate-180" />
            )}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 text-amber-400 flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-amber-400 flex-shrink-0" />
            )}
            <span className="font-medium text-slate-200 dir-ltr">{node.name}</span>
          </>
        ) : (
          <>
            <span className="w-3.5 h-3.5 flex-shrink-0" />
            {getFileIcon(node.name)}
            <span className="font-mono text-slate-300 dir-ltr">{node.name}</span>
          </>
        )}
      </div>

      {isDirectory && isOpen && node.children && (
        <div className="pl-4 rtl:pr-4 rtl:pl-0 border-l rtl:border-r rtl:border-l-0 border-slate-800 ml-3 rtl:mr-3 rtl:ml-0 my-0.5 space-y-0.5">
          {node.children.map((childNode) => (
            <TreeNode
              key={childNode.path}
              node={childNode}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  tree,
  selectedFile,
  onSelectFile,
  lang
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isAr = lang === 'ar';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <FolderTree className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
            {isAr ? 'شجرة مجلد aljawhara' : 'aljawhara App Explorer'}
          </h2>
        </div>
        <span className="text-[11px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
          Frappe v15 App
        </span>
      </div>

      {/* Search Bar */}
      <div className="my-3 relative">
        <Search className="w-3.5 h-3.5 absolute left-3 rtl:right-3 rtl:left-auto top-2.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isAr ? 'بحث في ملفات المجلد...' : 'Filter app files...'}
          className="w-full pl-8 rtl:pr-8 rtl:pl-3 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Quick Category Shortcuts */}
      <div className="flex items-center space-x-1.5 rtl:space-x-reverse mb-3 overflow-x-auto pb-1 text-[11px]">
        <button
          onClick={() => onSelectFile('aljawhara/aljawhara/hooks.py')}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded border border-slate-700 whitespace-nowrap transition-colors"
        >
          hooks.py
        </button>
        <button
          onClick={() => onSelectFile('aljawhara/aljawhara/modules.txt')}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded border border-slate-700 whitespace-nowrap transition-colors"
        >
          modules.txt
        </button>
        <button
          onClick={() => onSelectFile('aljawhara/aljawhara/translations/ar.json')}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded border border-slate-700 whitespace-nowrap transition-colors"
        >
          ar.json (RTL)
        </button>
        <button
          onClick={() => onSelectFile('aljawhara/Dockerfile')}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded border border-slate-700 whitespace-nowrap transition-colors"
        >
          Dockerfile
        </button>
      </div>

      {/* Tree Content */}
      <div className="overflow-auto flex-1 pr-1 rtl:pl-1 rtl:pr-0 space-y-1">
        {tree.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center">
            {isAr ? 'جاري قراءة هيكل المجلد...' : 'Reading app structure...'}
          </div>
        ) : (
          tree.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              searchQuery={searchQuery}
            />
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>{isAr ? 'هيكل خالٍ من التعديل المباشر' : 'Clean Extension Arch'}</span>
        <span className="font-mono text-emerald-400">ERPNext v15+</span>
      </div>

    </div>
  );
};
