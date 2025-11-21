
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { FeaturesPage } from './components/FeaturesPage';
import { PricingPage } from './components/PricingPage';
import { EnterprisePage } from './components/EnterprisePage';
import { analyzeSeo } from './services/gemini';
import { SeoResult, AuditType, HistoryItem } from './types';
import { Box, Clock, ArrowRight } from 'lucide-react';

export type View = 'HOME' | 'FEATURES' | 'PRICING' | 'ENTERPRISE' | 'DASHBOARD';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('auditHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleAnalyze = useCallback(async (url: string, htmlInput: string, type: AuditType, audience: string, geo: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentView('DASHBOARD'); // Switch to dashboard view

    try {
      const analysis = await analyzeSeo(url, htmlInput, type, audience, geo);
      setResult(analysis);
      
      // Save to History
      const newItem: HistoryItem = {
        id: analysis.id,
        url: analysis.url,
        timestamp: Date.now(),
        score: analysis.overallScore,
        errorCount: analysis.issues.length,
        type: analysis.auditType
      };
      
      setHistory(prev => {
          const updated = [newItem, ...prev].slice(0, 10); // Keep last 10
          localStorage.setItem('auditHistory', JSON.stringify(updated));
          return updated;
      });
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please ensure you have a valid API key set and try again.");
      setCurrentView('HOME'); // Go back home on error
    } finally {
      setLoading(false);
    }
  }, []);

  const renderView = () => {
    if (loading) {
        return (
             <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-12">
                 <div className="flex flex-col items-center mb-12">
                     <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-6 animate-bounce">
                        <Box className="w-8 h-8 text-indigo-600" />
                     </div>
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white animate-pulse">Generating Intelligence</h2>
                     <p className="text-slate-500 mt-2 font-mono text-xs">Processing vectors & competitive data...</p>
                 </div>
                 <DashboardSkeleton />
            </div>
        );
    }

    switch (currentView) {
        case 'FEATURES':
            return <FeaturesPage onStart={() => setCurrentView('HOME')} />;
        case 'PRICING':
            return <PricingPage onStart={() => setCurrentView('HOME')} />;
        case 'ENTERPRISE':
            return <EnterprisePage />;
        case 'DASHBOARD':
            return result ? <AnalysisDashboard result={result} history={history} onReset={() => { setResult(null); setCurrentView('HOME'); }} /> : <Hero onAnalyze={handleAnalyze} error={error} />;
        case 'HOME':
        default:
            return <Hero onAnalyze={handleAnalyze} error={error} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-indigo-500/30`}>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} setView={setCurrentView} currentView={currentView} />
      
      {/* History Sidebar Toggle - Only show on Home/Dashboard when not loading */}
      {history.length > 0 && !loading && (currentView === 'HOME' || currentView === 'DASHBOARD') && (
         <button 
            onClick={() => setShowHistory(!showHistory)}
            className="fixed top-24 right-0 z-50 bg-white dark:bg-slate-900 border-l border-y border-slate-200 dark:border-slate-800 p-2 rounded-l-lg shadow-md flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:pr-4 transition-all"
         >
            <Clock className="w-4 h-4" /> History
         </button>
      )}

      {/* History Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 shadow-2xl overflow-y-auto ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-sm">Recent Audits</h3>
            <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-900">
                <ArrowRight className="w-4 h-4" />
            </button>
         </div>
         <div className="p-4 space-y-3">
            {history.map(item => (
                <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-indigo-500 cursor-pointer transition-colors">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{new URL(item.url).hostname}</span>
                        <span className={`text-xs font-bold ${item.score > 70 ? 'text-green-500' : 'text-amber-500'}`}>{item.score}</span>
                    </div>
                    <div className="flex justify-between items-center">
                         <span className="text-[10px] text-slate-500 uppercase">{item.type}</span>
                         <span className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
         </div>
      </div>
      
      <main className="flex-grow relative">
        {renderView()}
      </main>

      <footer className="bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 py-12 border-t border-slate-200 dark:border-slate-900 mt-auto relative z-10">
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                 <div className="flex items-center gap-2 mb-4">
                    <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-1.5 rounded-lg">
                        <Box className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">AuditPro</span>
                 </div>
                 <p className="text-sm text-slate-500 leading-relaxed">
                    Enterprise-grade SEO intelligence for modern marketing teams.
                 </p>
              </div>
              <div>
                 <h4 className="font-bold text-slate-900 dark:text-white mb-4">Product</h4>
                 <ul className="space-y-2 text-sm">
                    <li><button onClick={() => setCurrentView('FEATURES')} className="hover:text-indigo-500">Features</button></li>
                    <li><button onClick={() => setCurrentView('PRICING')} className="hover:text-indigo-500">Pricing</button></li>
                    <li><button onClick={() => setCurrentView('ENTERPRISE')} className="hover:text-indigo-500">Enterprise</button></li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-bold text-slate-900 dark:text-white mb-4">Resources</h4>
                 <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-indigo-500">Documentation</a></li>
                    <li><a href="#" className="hover:text-indigo-500">API Reference</a></li>
                    <li><a href="#" className="hover:text-indigo-500">Blog</a></li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
                 <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-indigo-500">Privacy</a></li>
                    <li><a href="#" className="hover:text-indigo-500">Terms</a></li>
                 </ul>
              </div>
           </div>
          <div className="text-center text-xs font-mono uppercase tracking-widest border-t border-slate-100 dark:border-slate-800 pt-8">
             &copy; {new Date().getFullYear()} AuditPro Intelligence.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;