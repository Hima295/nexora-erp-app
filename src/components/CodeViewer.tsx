import React, { useState } from 'react';
import { Copy, Check, FileCode, HardDrive, Hash } from 'lucide-react';
import { LanguageMode } from '../types';

interface CodeViewerProps {
  filePath: string | null;
  content: string | null;
  loading: boolean;
  lang: LanguageMode;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  filePath,
  content,
  loading,
  lang
}) => {
  const [copied, setCopied] = useState(false);
  const isAr = lang === 'ar';

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="h-full min-h-[480px] bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs">{isAr ? 'جاري تحميل الملف...' : 'Loading file content...'}</span>
        </div>
      </div>
    );
  }

  if (!filePath || content === null) {
    return (
      <div className="h-full min-h-[480px] bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 p-8 text-center">
        <div className="max-w-md space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <FileCode className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-300">
            {isAr ? 'اختر ملفاً لمعاينته' : 'Select a File to Inspect'}
          </h3>
          <p className="text-xs text-slate-400">
            {isAr 
              ? 'تصفح شجرة ملفات تطبيق الجوهرة المخصص للتحقق من ملفات بايثون وإعدادات hooks وترجمات العربية.' 
              : 'Browse the Aljawhara custom Frappe app file tree to inspect Python classes, hooks.py, JSON schemas, and translation mappings.'}
          </p>
        </div>
      </div>
    );
  }

  const lines = content.split('\n');
  const getFileBadge = (path: string) => {
    if (path.endsWith('.py')) return { label: 'Python 3', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    if (path.endsWith('.json')) return { label: 'JSON Schema', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    if (path.endsWith('.js')) return { label: 'JavaScript', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
    if (path.endsWith('.css')) return { label: 'CSS Styles', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' };
    if (path.endsWith('.toml') || path.endsWith('.yml')) return { label: 'Config / Yaml', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    if (path.endsWith('.md')) return { label: 'Markdown Docs', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    return { label: 'File', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  };

  const badge = getFileBadge(filePath);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* File Viewer Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
          <FileCode className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="font-mono text-xs font-medium text-slate-200 truncate dir-ltr">
            {filePath}
          </span>
          <span className={`px-2 py-0.5 text-[10px] font-semibold border rounded ${badge.color}`}>
            {badge.label}
          </span>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="hidden sm:flex items-center space-x-1 rtl:space-x-reverse text-xs text-slate-400">
            <Hash className="w-3.5 h-3.5" />
            <span>{lines.length} {isAr ? 'سطر' : 'lines'}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{isAr ? 'تم النسخ' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{isAr ? 'نسخ الكود' : 'Copy Code'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body with Line Numbers */}
      <div className="p-4 overflow-auto flex-1 font-mono text-xs leading-relaxed text-slate-300 dir-ltr select-text bg-slate-950">
        <div className="table w-full min-w-full">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row hover:bg-slate-900/50 transition-colors">
              <span className="table-cell pr-4 text-right text-slate-600 select-none w-10 font-mono text-[11px] align-top border-r border-slate-800/60 pr-2">
                {idx + 1}
              </span>
              <span className="table-cell pl-4 whitespace-pre text-slate-200 font-mono text-[12px] align-top">
                {line || ' '}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
