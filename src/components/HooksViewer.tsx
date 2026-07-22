import React from 'react';
import { Layers, Zap, Clock, ShieldAlert, Cpu, Eye, ArrowRight, Code } from 'lucide-react';
import { LanguageMode } from '../types';

interface HooksViewerProps {
  lang: LanguageMode;
  onSelectFile: (path: string) => void;
}

export const HooksViewer: React.FC<HooksViewerProps> = ({ lang, onSelectFile }) => {
  const isAr = lang === 'ar';

  const docEvents = [
    {
      doctype: 'Sales Order',
      event: 'on_submit',
      handler: 'aljawhara.overrides.doc_events.on_sales_order_submit',
      purposeEn: 'Triggers sales analytics audit log non-invasively on order confirmation.',
      purposeAr: 'تسجيل تدقيق تحليلات المبيعات تلقائياً عند اعتماد أمر البيع.'
    },
    {
      doctype: 'Sales Order',
      event: 'on_cancel',
      handler: 'aljawhara.overrides.doc_events.on_sales_order_cancel',
      purposeEn: 'Logs cancellation alerts for sales risk management.',
      purposeAr: 'سجل تنبيهات الإلغاء لإدارة مخاطر المبيعات.'
    },
    {
      doctype: 'Purchase Order',
      event: 'on_submit',
      handler: 'aljawhara.overrides.doc_events.on_purchase_order_submit',
      purposeEn: 'Tracks purchasing commitments against vendor performance targets.',
      purposeAr: 'تتبع التزامات الشراء مقابل أهداف أداء الموردين.'
    },
    {
      doctype: 'Stock Entry',
      event: 'on_submit',
      handler: 'aljawhara.overrides.doc_events.on_stock_entry_submit',
      purposeEn: 'Monitors inventory movements across warehouses.',
      purposeAr: 'مراقبة تحركات المخزون عبر المستودعات المختلفة.'
    }
  ];

  const cronEvents = [
    {
      frequency: 'Hourly',
      frequencyAr: 'كل ساعة',
      handler: 'aljawhara.tasks.cron.hourly_analytics_sync',
      descriptionEn: 'Syncs analytics metrics and updates cached summaries.',
      descriptionAr: 'تحديث مقاييس التحليلات المخبأة دورياً.'
    },
    {
      frequency: 'Daily',
      frequencyAr: 'يومياً',
      handler: 'aljawhara.tasks.cron.daily_decision_support_digest',
      descriptionEn: 'Generates executive decision alerts and system health digest.',
      descriptionAr: 'توليد ملخص تنبيهات القرارات التنفيذية اليومية.'
    },
    {
      frequency: 'Weekly',
      frequencyAr: 'أسبوعياً',
      handler: 'aljawhara.tasks.cron.weekly_system_health_check',
      descriptionEn: 'Cleans audit logs based on configured retention policies.',
      descriptionAr: 'تنظيف سجلات التدقيق القديمة حسب سياسة الاحتفاظ.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>{isAr ? 'الهيكل البرمجي الممتد (hooks.py)' : 'Extension Blueprint (hooks.py)'}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            {isAr ? 'مراقبات أحداث ERPNext المهيكلة' : 'Non-Invasive ERPNext Event Listeners'}
          </h2>
          <p className="text-xs text-slate-400">
            {isAr 
              ? 'تعتمد كافة الربط والتقاط الأحداث على ملف hooks.py دون تعديل أي ملف في ERPNext.' 
              : 'All hooks bind safely to standard ERPNext lifecycle events without modifying core files.'}
          </p>
        </div>

        <button
          onClick={() => onSelectFile('aljawhara/aljawhara/hooks.py')}
          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-xs font-semibold border border-slate-700 transition-colors self-start md:self-auto"
        >
          <Code className="w-4 h-4" />
          <span>{isAr ? 'عرض ملف hooks.py الأصلي' : 'View Raw hooks.py'}</span>
        </button>
      </div>

      {/* Doc Events Observers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              {isAr ? 'مراقبات مستندات ERPNext الرئيسية' : 'ERPNext DocType Event Observers'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Non-Invasive doc_events
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {docEvents.map((item, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-850/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="px-2 py-0.5 text-xs font-bold bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                    {item.doctype}
                  </span>
                  <span className="text-xs font-mono text-amber-400">
                    {item.event}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {isAr ? item.purposeAr : item.purposeEn}
                </p>
              </div>

              <div className="font-mono text-[11px] text-slate-400 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-left dir-ltr max-w-md overflow-x-auto">
                {item.handler}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Background Tasks */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Clock className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              {isAr ? 'مهام الخلفية المجدولة (Frappe Scheduler)' : 'Frappe Cron Scheduler Tasks'}
            </h3>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {cronEvents.map((cron, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-850/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 text-xs font-bold bg-purple-500/10 text-purple-400 rounded border border-purple-500/20">
                  {isAr ? cron.frequencyAr : cron.frequency}
                </span>
                <p className="text-xs text-slate-300 mt-1">
                  {isAr ? cron.descriptionAr : cron.descriptionEn}
                </p>
              </div>

              <div className="font-mono text-[11px] text-slate-400 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-left dir-ltr max-w-md overflow-x-auto">
                {cron.handler}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
