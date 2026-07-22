import React, { useState } from 'react';
import { Languages, Search, CheckCircle2, Globe, FileCode } from 'lucide-react';
import { LanguageMode } from '../types';

interface TranslationPreviewerProps {
  arJson: string | null;
  enJson: string | null;
  lang: LanguageMode;
  onSelectFile: (path: string) => void;
}

export const TranslationPreviewer: React.FC<TranslationPreviewerProps> = ({
  arJson,
  enJson,
  lang,
  onSelectFile
}) => {
  const [filter, setFilter] = useState('');
  const isAr = lang === 'ar';

  let arDict: Record<string, string> = {};
  let enDict: Record<string, string> = {};

  try {
    if (arJson) arDict = JSON.parse(arJson);
    if (enJson) enDict = JSON.parse(enJson);
  } catch (e) {
    // fallback
  }

  const keys = Array.from(new Set([...Object.keys(arDict), ...Object.keys(enDict)]));
  const filteredKeys = keys.filter(k => 
    k.toLowerCase().includes(filter.toLowerCase()) ||
    (arDict[k] && arDict[k].includes(filter)) ||
    (enDict[k] && enDict[k].toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Languages className="w-4 h-4" />
            <span>{isAr ? 'قاموس الترجمة المزدوج' : 'Bi-Directional Translation Matrix'}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            {isAr ? 'معاينة قاموس العربية (ar.json) والإنجليزية (en.json)' : 'Arabic (RTL) & English (LTR) Translation Dictionary'}
          </h2>
          <p className="text-xs text-slate-400">
            {isAr 
              ? 'تراجم قياسية متوافقة مع محرك ترجمات Frappe لتوفير تجربة مستخدم عربية كاملة.' 
              : 'Standard Frappe dictionary keys mapped for seamless Arabic (RTL) & English (LTR) rendering.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => onSelectFile('aljawhara/aljawhara/translations/ar.json')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            ar.json
          </button>
          <button
            onClick={() => onSelectFile('aljawhara/aljawhara/translations/en.json')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            en.json
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 rtl:right-3 rtl:left-auto top-3 text-slate-500" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={isAr ? 'تصفية المصطلحات والترجمات...' : 'Filter terms and translated keys...'}
          className="w-full pl-9 rtl:pr-9 rtl:pl-4 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Dictionary Mapping Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-slate-800 bg-slate-950 px-4 py-3 border-b border-slate-800 text-xs font-bold text-slate-300">
          <div>{isAr ? 'المصطلح باللغة الإنجليزية (Frappe Key)' : 'English Frappe Term Key'}</div>
          <div className="pt-2 md:pt-0">{isAr ? 'الترجمة المعتمدة بالعربية (RTL Translation)' : 'Arabic Translation (RTL)'}</div>
        </div>

        <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto">
          {filteredKeys.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              {isAr ? 'لا توجد مصطلحات مطابقة' : 'No matching terms found'}
            </div>
          ) : (
            filteredKeys.map((key, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-slate-800/60 p-3 hover:bg-slate-850/50 text-xs transition-colors">
                <div className="font-mono text-slate-300 dir-ltr flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                  <span>{key}</span>
                </div>
                <div className="font-sans font-semibold text-amber-300 pt-2 md:pt-0 flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></span>
                  <span>{arDict[key] || key}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
