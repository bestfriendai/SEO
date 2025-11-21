
import React, { useState } from 'react';
import { Search, ArrowRight, Terminal, Globe, Smartphone, Target, MapPin, Zap, BarChart2, ShieldCheck, Layers } from 'lucide-react';
import { AuditType } from '../types';

interface HeroProps {
  onAnalyze: (url: string, html: string, type: AuditType, audience: string, geo: string) => void;
  error: string | null;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyze, error }) => {
  const [url, setUrl] = useState('');
  const [html, setHtml] = useState('');
  const [showHtmlInput, setShowHtmlInput] = useState(false);
  const [auditType, setAuditType] = useState<AuditType>(AuditType.WEB);
  const [audience, setAudience] = useState('General');
  const [geo, setGeo] = useState('Global');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onAnalyze(url, html, auditType, audience, geo);
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 transition-colors duration-500 min-h-[90vh] flex items-center">
      
      {/* Animated Background - Light Mode: Colorful / Dark Mode: Technical & Stealth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-slate-800/10 rounded-full blur-[100px] animate-float pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/20 dark:bg-slate-800/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>
      
      {/* Technical Grid Overlay - More pronounced in Dark Mode */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-100 dark:opacity-30 pointer-events-none mask-image-gradient"></div>
      
      {/* Dark Mode Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-white/0 dark:bg-white/5 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="relative container mx-auto px-6 pt-20 pb-16 max-w-6xl z-10">
        
        <div className="text-center mb-12">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 text-xs font-bold text-indigo-600 dark:text-slate-300 uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
                <Zap className="w-3 h-3 text-amber-500" /> Gemini 2.5 AI Engine Active
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
            The #1 AI-Powered <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600 dark:from-white dark:to-slate-400">
                SEO Intelligence Platform
            </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 font-medium">
                Audit your site, spy on competitors, and uncover hidden traffic opportunities with enterprise-grade precision. Trusted by over 10,000 marketers.
            </p>
        </div>

        {/* Main Search Card */}
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 max-w-3xl mx-auto relative z-20 animate-in fade-in zoom-in-95 duration-500 delay-200 ring-1 ring-slate-900/5 dark:ring-white/10">
             {/* Tabs */}
             <div className="flex gap-1 p-1 mb-2">
                <button onClick={() => setAuditType(AuditType.WEB)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${auditType === AuditType.WEB ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                     Web Audit
                </button>
                <button onClick={() => setAuditType(AuditType.APP)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${auditType === AuditType.APP ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                     App Store ASO
                </button>
             </div>

             <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-2">
                <div className="relative group">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-white transition-colors" />
                    <input
                        type="url"
                        required
                        placeholder={auditType === AuditType.WEB ? "Enter domain (e.g., semrush.com)" : "Enter App Store URL"}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-slate-500/50 text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 transition-all shadow-inner"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                     <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-slate-500/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                        <option value="General">General Audience</option>
                        <option value="B2B">B2B Enterprise</option>
                        <option value="SaaS">SaaS / Tech</option>
                        <option value="E-commerce">E-commerce</option>
                    </select>
                    <select value={geo} onChange={(e) => setGeo(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-slate-500/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                        <option value="Global">Global (English)</option>
                        <option value="USA">United States</option>
                        <option value="EU">Europe</option>
                        <option value="Asia">Asia Pacific</option>
                    </select>
                </div>

                <button type="submit" disabled={!url} className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 dark:hover:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
                    Start Free Audit <ArrowRight className="w-5 h-5" />
                </button>

                 {/* Advanced Context Toggle */}
                 <div className="mt-2 px-2">
                     <button type="button" onClick={() => setShowHtmlInput(!showHtmlInput)} className="text-xs font-bold text-slate-400 hover:text-indigo-500 dark:hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors">
                         <Terminal className="w-3 h-3" /> {showHtmlInput ? 'Hide Source' : 'Add Context Source'}
                     </button>
                     {showHtmlInput && (
                         <textarea
                             className="w-full h-32 mt-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-xs focus:outline-none focus:border-indigo-500 dark:focus:border-slate-500 text-slate-700 dark:text-slate-300"
                             placeholder="Paste raw HTML or content..."
                             value={html}
                             onChange={(e) => setHtml(e.target.value)}
                         />
                     )}
                 </div>
             </form>
        </div>

        {error && (
          <div className="mt-6 max-w-lg mx-auto bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-center text-sm font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* Social Proof */}
        <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800/50">
            <p className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">Trusted by top marketing teams</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 dark:opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                 <div className="flex items-center gap-2 font-bold text-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors"><Layers className="w-6 h-6" /> ACME Corp</div>
                 <div className="flex items-center gap-2 font-bold text-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors"><Globe className="w-6 h-6" /> GlobalTech</div>
                 <div className="flex items-center gap-2 font-bold text-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors"><Target className="w-6 h-6" /> FocusMedia</div>
                 <div className="flex items-center gap-2 font-bold text-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors"><ShieldCheck className="w-6 h-6" /> SecureNet</div>
            </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
             <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:bg-slate-900 transition-all group">
                 <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600 dark:text-white mb-4 group-hover:scale-110 transition-transform">
                    <BarChart2 className="w-6 h-6" />
                 </div>
                 <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Deep Competitor Analysis</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Spy on traffic, keywords, and backlink strategies of your top 3 rivals automatically.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:bg-slate-900 transition-all group">
                 <div className="w-12 h-12 bg-fuchsia-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-fuchsia-600 dark:text-white mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6" />
                 </div>
                 <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">AI-Powered Fixes</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Don't just see the errors. Get copy-paste code snippets and content rewrites instantly.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:bg-slate-900 transition-all group">
                 <div className="w-12 h-12 bg-amber-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-amber-600 dark:text-white mb-4 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-6 h-6" />
                 </div>
                 <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Web & App Intelligence</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Whether it's Google SEO or Apple App Store Optimization, we have the specialized models.</p>
             </div>
        </div>
      </div>
    </div>
  );
};
