import React, { useState } from 'react';
import { Terminal, Copy, Check, Container, Play, Server, HardDrive, Cpu } from 'lucide-react';
import { BenchCommand, LanguageMode } from '../types';

interface BenchCliGeneratorProps {
  commands: BenchCommand[];
  lang: LanguageMode;
  onSelectFile: (path: string) => void;
}

export const BenchCliGenerator: React.FC<BenchCliGeneratorProps> = ({
  commands,
  lang,
  onSelectFile
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const isAr = lang === 'ar';

  const handleCopy = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>{isAr ? 'دليل الأوامر والنشر' : 'Deployment & Bench CLI Matrix'}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            {isAr ? 'أوامر Bench و Docker الجاهزة للتنفيذ' : 'Production Bench & Docker Installation Commands'}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            {isAr
              ? 'انسخ الأوامر القياسية لتثبيت تطبيق الجوهرة المخصص على بيئة Frappe Bench أو تشغيله مباشرة عبر Docker Container.'
              : 'Execute standard Frappe Bench CLI commands or boot the complete Docker stack.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => onSelectFile('aljawhara/Dockerfile')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            Dockerfile
          </button>
          <button
            onClick={() => onSelectFile('aljawhara/docker-compose.yml')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            docker-compose.yml
          </button>
        </div>
      </div>

      {/* Commands List */}
      <div className="space-y-3">
        {commands.map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-all shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                {idx + 1}. {item.label}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {item.command.startsWith('docker') ? 'Container Execution' : 'Frappe Bench CLI'}
              </span>
            </div>

            <p className="text-xs text-slate-400">{item.description}</p>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between font-mono text-xs text-blue-300 dir-ltr overflow-x-auto space-x-3">
              <span className="whitespace-nowrap">$ {item.command}</span>
              <button
                onClick={() => handleCopy(item.command, idx)}
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[11px] font-sans flex-shrink-0 transition-colors"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isAr ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
