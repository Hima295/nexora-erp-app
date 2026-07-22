import React from 'react';
import { Layers, CheckCircle2, Terminal, Languages, Shield, Diamond, FileCode } from 'lucide-react';
import { LanguageMode } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: LanguageMode;
  setLang: (lang: LanguageMode) => void;
  complianceScore: number | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  complianceScore
}) => {
  const isAr = lang === 'ar';

  const navItems = [
    {
      id: 'tree',
      labelEn: 'App File Structure',
      labelAr: 'هيكل ملفات التطبيق',
      icon: FileCode
    },
    {
      id: 'compliance',
      labelEn: 'Frappe v15 Compliance',
      labelAr: 'التوافق مع Frappe v15',
      icon: Shield,
      badge: complianceScore !== null ? `${complianceScore}%` : undefined
    },
    {
      id: 'hooks',
      labelEn: 'Hooks & ERPNext Observers',
      labelAr: 'الخطاطيف ومراقبات ERPNext',
      icon: Layers
    },
    {
      id: 'cli',
      labelEn: 'Bench & Docker CLI',
      labelAr: 'أوامر Bench و Docker',
      icon: Terminal
    },
    {
      id: 'translations',
      labelEn: 'Arabic / English Dictionary',
      labelAr: 'قاموس العربية والإنجليزية',
      icon: Languages
    }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Application Title */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
              <Diamond className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <h1 className="font-bold text-lg tracking-wide text-slate-100">
                  {isAr ? 'الجوهرة | Aljawhara' : 'Aljawhara | الجوهرة'}
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                  Frappe v15+
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {isAr 
                  ? 'تطبيق مخصص لربط وتوسيع ERPNext بنواة غير ممسوسة' 
                  : 'Enterprise Custom Frappe App for Extending ERPNext'}
              </p>
            </div>
          </div>

          {/* Action Tools & Language Toggle */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title={isAr ? 'التحويل إلى الإنجليزية' : 'Switch to Arabic'}
            >
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAr ? 'English (LTR)' : 'العربية (RTL)'}</span>
            </button>

            {/* Compliance Badge */}
            <div className="hidden md:flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {isAr ? 'نواة ERPNext ناصعة' : 'Core Untouched'}
              </span>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 rtl:space-x-reverse border-t border-slate-800 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{isAr ? item.labelAr : item.labelEn}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
