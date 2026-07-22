import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, RefreshCw, AlertCircle, Layers, Server, Shield, Sparkles, FileCheck, Check } from 'lucide-react';
import { ValidationResult, LanguageMode } from '../types';

interface ComplianceInspectorProps {
  validation: ValidationResult | null;
  loading: boolean;
  onRefresh: () => void;
  lang: LanguageMode;
}

export const ComplianceInspector: React.FC<ComplianceInspectorProps> = ({
  validation,
  loading,
  onRefresh,
  lang
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'تطبيق Frappe مخصص معتمد v15+' : 'Certified Frappe v15+ Custom App'}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              {isAr ? 'تدقيق معايير الهندسة ونواة ERPNext' : 'ERPNext Isolation & Frappe Standards Compliance Audit'}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {isAr
                ? 'يضمن هذا الفحص التزام تطبيق "aljawhara" التام بقواعد Frappe Framework بدون مس أي سطر كود داخل ERPNext مع اعتماد ERPNext كمصدر واحد ومباشر للحقيقة.'
                : 'Verifies that "aljawhara" operates strictly inside its isolated custom app boundaries, maintaining ERPNext v15 as the Single Source of Truth.'}
            </p>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex-shrink-0">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                {validation ? `${validation.score}%` : '100%'}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                {isAr ? 'درجة التوافق' : 'Compliance Score'}
              </div>
            </div>
            <div className="h-10 w-px bg-slate-800"></div>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-xs shadow-md transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'إعادة الفحص' : 'Re-Run Audit'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Architectural Guarantees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-200">
            {isAr ? 'ERPNext Core Untouched' : 'ERPNext Core Untouched'}
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            {isAr
              ? 'تتم إضافة كافة الخصائص والحقول والمستمعات عبر fixtures و hooks.py دون تعديل ملفات ERPNext.'
              : 'All hooks, events, and custom fields reside strictly in aljawhara directory.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Server className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-200">
            {isAr ? 'المصدر الوحيد للحقيقة' : 'Single Source of Truth'}
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            {isAr
              ? 'يعتمد التطبيق مباشرة على جداول ERPNext الرسمية (Item, Sales Order) بدون قواعد بيانات مكررة.'
              : 'Queries standard ERPNext DocTypes directly with zero duplicated shadow tables.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-200">
            {isAr ? 'دعم العربية RTL و LTR' : 'RTL & LTR Bi-Directional'}
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            {isAr
              ? 'مكتبة ترجمات كاملة باللغة العربية (ar.json) مع ملائمات وتنسيقات CSS لواجهة Frappe Desk.'
              : 'Native Arabic (ar.json) and English (en.json) dictionaries with Desk RTL CSS overrides.'}
          </p>
        </div>

      </div>

      {/* Validation Checks Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <FileCheck className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              {isAr ? 'نتائج فحص عناصر التطبيق' : 'Detailed Verification Checklist'}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {validation ? `${validation.passed_checks}/${validation.total_checks} Passed` : 'Checking...'}
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {validation?.checks.map((check, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-850/50 transition-colors flex items-start space-x-3 rtl:space-x-reverse">
              <div className="mt-0.5 flex-shrink-0">
                {check.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200">{check.title}</h4>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 rounded border border-slate-700">
                    {check.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{check.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
