import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FileExplorer } from './components/FileExplorer';
import { CodeViewer } from './components/CodeViewer';
import { ComplianceInspector } from './components/ComplianceInspector';
import { HooksViewer } from './components/HooksViewer';
import { BenchCliGenerator } from './components/BenchCliGenerator';
import { TranslationPreviewer } from './components/TranslationPreviewer';
import { ModuleArchitecture } from './components/ModuleArchitecture';
import { FileNode, ValidationResult, BenchCommand, LanguageMode } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('tree');
  const [lang, setLang] = useState<LanguageMode>('ar');

  // File explorer states
  const [tree, setTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>('aljawhara/aljawhara/hooks.py');
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState<boolean>(false);

  // Compliance inspector state
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [loadingValidation, setLoadingValidation] = useState<boolean>(false);

  // Bench commands state
  const [benchCommands, setBenchCommands] = useState<BenchCommand[]>([]);

  // Raw translation strings for side-by-side preview
  const [arJsonContent, setArJsonContent] = useState<string | null>(null);
  const [enJsonContent, setEnJsonContent] = useState<string | null>(null);

  // Fetch Tree
  const fetchTree = async () => {
    try {
      const res = await fetch('/api/aljawhara/tree');
      const data = await res.json();
      if (data.success && data.tree) {
        setTree(data.tree);
      }
    } catch (e) {
      console.error('Failed to fetch tree:', e);
    }
  };

  // Fetch File
  const fetchFile = async (filePath: string) => {
    setLoadingFile(true);
    setSelectedFile(filePath);
    try {
      const res = await fetch(`/api/aljawhara/file?path=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      if (data.success) {
        setFileContent(data.content);
      } else {
        setFileContent(`// Failed to load file: ${data.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      setFileContent(`// Error reading file: ${e.message}`);
    } finally {
      setLoadingFile(false);
    }
  };

  // Fetch Validation Audit
  const fetchValidation = async () => {
    setLoadingValidation(true);
    try {
      const res = await fetch('/api/aljawhara/validate');
      const data = await res.json();
      if (data.success) {
        setValidation(data);
      }
    } catch (e) {
      console.error('Failed to run validation:', e);
    } finally {
      setLoadingValidation(false);
    }
  };

  // Fetch Bench Commands
  const fetchBenchCommands = async () => {
    try {
      const res = await fetch('/api/aljawhara/bench-commands');
      const data = await res.json();
      if (data.success) {
        setBenchCommands(data.commands);
      }
    } catch (e) {
      console.error('Failed to fetch bench commands:', e);
    }
  };

  // Fetch translations for comparison
  const fetchTranslations = async () => {
    try {
      const resAr = await fetch('/api/aljawhara/file?path=aljawhara/aljawhara/translations/ar.json');
      const dataAr = await resAr.json();
      if (dataAr.success) setArJsonContent(dataAr.content);

      const resEn = await fetch('/api/aljawhara/file?path=aljawhara/aljawhara/translations/en.json');
      const dataEn = await resEn.json();
      if (dataEn.success) setEnJsonContent(dataEn.content);
    } catch (e) {
      console.error('Failed to fetch translations:', e);
    }
  };

  useEffect(() => {
    fetchTree();
    fetchValidation();
    fetchBenchCommands();
    fetchTranslations();
    fetchFile('aljawhara/aljawhara/hooks.py');
  }, []);

  const isAr = lang === 'ar';

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-slate-950 text-slate-100 font-sans ${isAr ? 'font-arabic' : ''}`}
    >
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        complianceScore={validation ? validation.score : null}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: File Explorer & Code Viewer */}
        {activeTab === 'tree' && (
          <div className="space-y-6">
            <ModuleArchitecture lang={lang} onSelectFile={(p) => { fetchFile(p); setActiveTab('tree'); }} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
              <div className="lg:col-span-4">
                <FileExplorer
                  tree={tree}
                  selectedFile={selectedFile}
                  onSelectFile={(p) => fetchFile(p)}
                  lang={lang}
                />
              </div>

              <div className="lg:col-span-8">
                <CodeViewer
                  filePath={selectedFile}
                  content={fileContent}
                  loading={loadingFile}
                  lang={lang}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Compliance Inspector */}
        {activeTab === 'compliance' && (
          <ComplianceInspector
            validation={validation}
            loading={loadingValidation}
            onRefresh={fetchValidation}
            lang={lang}
          />
        )}

        {/* Tab 3: Hooks & ERPNext Observers */}
        {activeTab === 'hooks' && (
          <HooksViewer
            lang={lang}
            onSelectFile={(p) => { fetchFile(p); setActiveTab('tree'); }}
          />
        )}

        {/* Tab 4: Bench & Docker CLI Commands */}
        {activeTab === 'cli' && (
          <BenchCliGenerator
            commands={benchCommands}
            lang={lang}
            onSelectFile={(p) => { fetchFile(p); setActiveTab('tree'); }}
          />
        )}

        {/* Tab 5: Arabic / English Translation Previewer */}
        {activeTab === 'translations' && (
          <TranslationPreviewer
            arJson={arJsonContent}
            enJson={enJsonContent}
            lang={lang}
            onSelectFile={(p) => { fetchFile(p); setActiveTab('tree'); }}
          />
        )}

      </main>

      {/* Persistent Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {isAr 
              ? 'تطبيق الجوهرة المخصص - مبني وفق معايير Frappe v15+ ونواة ERPNext ناصعة' 
              : 'Aljawhara Custom App Extension - Built for Frappe v15+ & Untouched ERPNext Core'}
          </span>
          <span className="font-mono text-slate-400">
            Aljawhara v0.0.1
          </span>
        </div>
      </footer>
    </div>
  );
}
