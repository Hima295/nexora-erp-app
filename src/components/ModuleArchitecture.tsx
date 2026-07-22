import React from 'react';
import { Layers, CheckCircle, Clock, Diamond, BarChart3, Package, ShoppingCart, ShoppingBag, Bot, ShieldCheck } from 'lucide-react';
import { LanguageMode } from '../types';

interface ModuleArchitectureProps {
  lang: LanguageMode;
  onSelectFile: (path: string) => void;
}

export const ModuleArchitecture: React.FC<ModuleArchitectureProps> = ({ lang, onSelectFile }) => {
  const isAr = lang === 'ar';

  const modules = [
    {
      id: 'aljawhara_core',
      nameEn: 'Aljawhara Core',
      nameAr: 'نواة الجوهرة',
      status: 'active',
      icon: Diamond,
      color: 'bg-blue-600 border-blue-500/30 text-blue-400',
      descriptionEn: 'App Single Settings, audit loggers, ERPNext observers, and hooks registration.',
      descriptionAr: 'الإعدادات الموحدة، سجلات التدقيق، مراقبات ERPNext ورابط الخطاطيف.',
      doctypes: ['Aljawhara Settings', 'Aljawhara Log']
    },
    {
      id: 'executive_analytics',
      nameEn: 'Executive Analytics',
      nameAr: 'التحليلات التنفيذية',
      status: 'roadmap',
      icon: BarChart3,
      color: 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400',
      descriptionEn: 'Planned executive decision cockpit and real-time enterprise KPI aggregation.',
      descriptionAr: 'مؤشرات الأداء الرئيسية ولوحات اتخاذ القرار التنفيذي المخططة.'
    },
    {
      id: 'inventory_intelligence',
      nameEn: 'Inventory Intelligence',
      nameAr: 'ذكاء المخزون',
      status: 'roadmap',
      icon: Package,
      color: 'bg-amber-600/10 border-amber-500/30 text-amber-400',
      descriptionEn: 'Planned reorder optimization, valuation analytics, and deadstock detection.',
      descriptionAr: 'تحليلات إعادة الطلب وتقييم المخزون واكتشاف المخزون الراكد.'
    },
    {
      id: 'sales_intelligence',
      nameEn: 'Sales Intelligence',
      nameAr: 'ذكاء المبيعات',
      status: 'roadmap',
      icon: ShoppingCart,
      color: 'bg-sky-600/10 border-sky-500/30 text-sky-400',
      descriptionEn: 'Planned revenue trends, customer margin insights, and sales order velocity.',
      descriptionAr: 'اتجهات الإيرادات وهوامش أرباح العملاء وسرعة أوامر البيع.'
    },
    {
      id: 'purchasing_intelligence',
      nameEn: 'Purchasing Intelligence',
      nameAr: 'ذكاء المشتريات',
      status: 'roadmap',
      icon: ShoppingBag,
      color: 'bg-purple-600/10 border-purple-500/30 text-purple-400',
      descriptionEn: 'Planned vendor lead-time monitoring, price variance alerts, and procurement trends.',
      descriptionAr: 'مراقبة فترات توريد الموردين وتنبيهات فروق الأسعار والمشتريات.'
    },
    {
      id: 'ai_decision_support',
      nameEn: 'AI Decision Support',
      nameAr: 'دعم القرار بالذكاء الاصطناعي',
      status: 'roadmap',
      icon: Bot,
      color: 'bg-rose-600/10 border-rose-500/30 text-rose-400',
      descriptionEn: 'Planned automated anomaly detection, demand forecasting, and smart alerts.',
      descriptionAr: 'اكتشاف التناقضات الآلي والتنبؤ بالطلب والتنبيهات الذكية.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>{isAr ? 'خارطة الوحدات والهيكلية' : 'Modular Extension Framework'}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            {isAr ? 'وحدات aljawhara المخصصة' : 'Aljawhara Custom App Modules Map'}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            {isAr 
              ? 'تتواجد كافة الوحدات مسجلة داخل modules.txt ومجهزة للتوسع المستقبلي دون المساس بنواة ERPNext.' 
              : 'All modules are registered inside modules.txt and ready for future reports, dashboards, and AI services.'}
          </p>
        </div>

        <button
          onClick={() => onSelectFile('aljawhara/aljawhara/modules.txt')}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
        >
          modules.txt
        </button>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isActive = mod.status === 'active';

          return (
            <div
              key={mod.id}
              className={`bg-slate-900 border rounded-xl p-5 space-y-3 relative overflow-hidden transition-all shadow-md ${
                isActive ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                {isActive ? (
                  <span className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold">
                    <CheckCircle className="w-3 h-3" />
                    <span>{isAr ? 'مُفعّل بالكامل' : 'Phase 1 Ready'}</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-[10px] font-medium">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{isAr ? 'هيكل مجهز' : 'Architected Baseline'}</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-200">
                  {isAr ? mod.nameAr : mod.nameEn}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {isAr ? mod.descriptionAr : mod.descriptionEn}
                </p>
              </div>

              {mod.doctypes && (
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {mod.doctypes.map((dt) => (
                    <span key={dt} className="px-2 py-0.5 text-[10px] font-mono bg-slate-950 text-blue-300 rounded border border-slate-800">
                      DocType: {dt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
