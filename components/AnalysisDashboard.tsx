
import React, { useState, useRef } from 'react';
import { SeoResult, Severity, Category, AuditType, SeoIssue, CodeFix, HistoryItem } from '../types';
import { ScoreChart } from './ScoreChart';
import { CompetitorRadar } from './CompetitorRadar';
import { CompetitorAnalysisTable } from './CompetitorAnalysisTable';
import { TrafficForecast } from './TrafficForecast';
import { CodeDiffModal } from './CodeDiffModal';
import { ChatAssistant } from './ChatAssistant';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon,
  Info,
  ArrowLeft, 
  Code2,
  Trophy,
  Search,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Fingerprint,
  Share2,
  Layers,
  Hash,
  Globe,
  ArrowUpRight,
  Zap,
  Clock,
  Target,
  FileText,
  Layout,
  Type,
  ImageIcon,
  Database,
  Link as LinkIcon,
  Smartphone,
  HelpCircle,
  X,
  Printer
} from 'lucide-react';

interface AnalysisDashboardProps {
  result: SeoResult;
  history: HistoryItem[];
  onReset: () => void;
}

const SECTIONS = [
    { id: 'kpi', label: 'KPIs & Performance Trend' },
    { id: 'competitors', label: 'Competitor Intelligence' },
    { id: 'keywords', label: 'Keyword Analysis' },
    { id: 'issues', label: 'Audit Findings' },
    { id: 'tech_specs', label: 'Technical Specifications' },
    { id: 'aso_specs', label: 'ASO Specifications' },
    { id: 'sidebar', label: 'Sidebar (SERP, Roadmap, etc.)' },
];

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, history, onReset }) => {
  const [activeTab, setActiveTab] = useState<Category | 'ALL'>('ALL');
  const [selectedFix, setSelectedFix] = useState<CodeFix | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>(SECTIONS.map(s => s.id));
  const [isExporting, setIsExporting] = useState(false);
  
  const dashboardRef = useRef<HTMLDivElement>(null);
  const isWeb = result.auditType === AuditType.WEB;

  const filteredIssues = activeTab === 'ALL' 
    ? result.issues 
    : result.issues.filter(i => i.category === activeTab);

  const handleDownloadPDF = async () => {
     if (!dashboardRef.current) return;
     setIsExporting(true);
     
     // 1. Hide unselected sections
     const originalDisplays = new Map<string, string>();
     SECTIONS.forEach(section => {
         if (!selectedSections.includes(section.id)) {
             const el = document.getElementById(`section-${section.id}`);
             if (el) {
                 originalDisplays.set(section.id, el.style.display);
                 el.style.display = 'none';
             }
         }
     });

     try {
         const { jsPDF } = window as any;
         const html2canvas = (window as any).html2canvas;
         if(!jsPDF || !html2canvas) throw new Error("PDF libraries not loaded");

         // Small delay to ensure DOM updates
         await new Promise(resolve => setTimeout(resolve, 100));

         const canvas = await html2canvas(dashboardRef.current, { scale: 1.5, useCORS: true, logging: false });
         const imgData = canvas.toDataURL('image/jpeg', 0.9);
         const pdf = new jsPDF('p', 'mm', 'a4');
         const pdfWidth = pdf.internal.pageSize.getWidth();
         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
         pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
         pdf.save(`audit-report-${result.url.replace(/[^a-z0-9]/gi, '_')}.pdf`);
     } catch (e) {
         console.error("PDF Export Error:", e);
         alert("Failed to generate PDF. Please try again.");
     } finally {
         // 2. Restore sections
         SECTIONS.forEach(section => {
             if (!selectedSections.includes(section.id)) {
                 const el = document.getElementById(`section-${section.id}`);
                 if (el) {
                     el.style.display = originalDisplays.get(section.id) || '';
                 }
             }
         });
         setIsExporting(false);
         setShowExportModal(false);
     }
  };

  const toggleSection = (id: string) => {
      setSelectedSections(prev => 
          prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
      );
  };

  const trendData = [...history].reverse().map(h => ({
      name: new Date(h.timestamp).toLocaleDateString(undefined, {month:'short', day:'numeric', hour: '2-digit', minute:'2-digit'}),
      score: h.score,
      errors: h.errorCount || 0
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-300">
      
      {/* Toolbar */}
      <div className="sticky top-20 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
            <button onClick={onReset} className="group flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-2">
                <img src={`https://www.google.com/s2/favicons?domain=${result.url}&sz=32`} alt="Favicon" className="w-5 h-5 rounded-sm" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">{new URL(result.url).hostname}</h2>
            </div>
         </div>
         <div className="flex gap-2">
             <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 text-white rounded text-xs font-bold uppercase tracking-wide shadow-md transition-all">
                <Download className="w-3 h-3" /> Export Report
             </button>
         </div>
      </div>

      <div ref={dashboardRef} className="relative container mx-auto px-4 sm:px-6 py-8 max-w-7xl z-10 space-y-6">
        
        {/* TOP: KPI BAR & HISTORY */}
        <div id="section-kpi" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Health Score</div>
                        <div className={`text-2xl font-bold ${result.overallScore > 80 ? 'text-green-500' : result.overallScore > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                            {result.overallScore}/100
                        </div>
                    </div>
                    <div className="w-10 h-10"><ScoreChart score={result.overallScore} size="sm" /></div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Errors Found</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{result.issues.length}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Est. Traffic (Mo)</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{result.competitors[0]?.metrics?.monthlyTraffic?.toLocaleString() || '~5K'}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                     <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Domain Auth</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{result.competitors[0]?.metrics?.domainAuthority || '24'}</div>
                </div>
            </div>

            {/* Historical Trend Chart */}
            {history.length > 1 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-top-8 duration-500">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-indigo-500" /> Performance Trend
                        </h3>
                        <span className="text-xs text-slate-500">Last {history.length} Audits</span>
                     </div>
                     <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
                                <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                                <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <Line yAxisId="left" type="monotone" dataKey="score" name="Health Score" stroke="#4f46e5" strokeWidth={2} dot={{r:4}} activeDot={{r:6}} />
                                <Line yAxisId="right" type="monotone" dataKey="errors" name="Errors Found" stroke="#ef4444" strokeWidth={2} dot={{r:4}} />
                            </LineChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            )}
        </div>

        {/* ROW 2: MAIN DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT: COMPETITIVE INTELLIGENCE (8 COLS) */}
            <div className="lg:col-span-8 space-y-6">
                
                {/* Competitor Deep Dive */}
                <div id="section-competitors" className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-500" /> Competitive Landscape
                            </h3>
                            <span className="text-xs font-mono text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">Live Estimates</span>
                        </div>
                        <CompetitorAnalysisTable competitors={result.competitors} me={result.url} />
                    </div>

                    {/* Traffic Growth Forecast & Radar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                <TrendingUp className="w-4 h-4 text-indigo-500" /> Traffic Growth Forecast
                            </h3>
                            {result.trafficForecast ? (
                                 <TrafficForecast data={result.trafficForecast} />
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-slate-400 text-xs">Insufficient data for forecast</div>
                            )}
                         </div>
                         
                         {/* Radar */}
                         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                <Layers className="w-4 h-4 text-fuchsia-500" /> Capabilities Gap
                            </h3>
                            <CompetitorRadar me={result.categoryScores} competitors={result.competitors} />
                         </div>
                    </div>
                </div>

                {/* Keyword Density Analysis */}
                {result.keywordAnalysis && (
                  <div id="section-keywords" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <Hash className="w-4 h-4 text-emerald-500" /> Keyword Density Analysis
                          </h3>
                          <span className="text-xs font-medium text-slate-500">
                              {result.keywordAnalysis.topKeywords.length} Keywords Analyzed
                          </span>
                      </div>
                      <div className="p-6">
                          {/* Advice Box */}
                          <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 p-4 rounded-lg">
                             <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                                <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                                   <span className="font-bold block mb-1 text-xs uppercase tracking-wider opacity-80">Optimization Advice</span>
                                   {result.keywordAnalysis.recommendation}
                                </p>
                             </div>
                          </div>

                          {/* Density Table */}
                          <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm">
                                  <thead>
                                      <tr className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                          <th className="pb-3 pl-2">Keyword</th>
                                          <th className="pb-3 text-right">Count</th>
                                          <th className="pb-3 pl-6 w-1/2">Density</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                      {result.keywordAnalysis.topKeywords.map((kw, idx) => (
                                          <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                              <td className="py-3 pl-2 font-medium text-slate-900 dark:text-white">{kw.keyword}</td>
                                              <td className="py-3 text-right font-mono text-slate-600 dark:text-slate-400">{kw.count}</td>
                                              <td className="py-3 pl-6">
                                                  <div className="flex items-center gap-3">
                                                      <div className="flex-grow h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                          <div 
                                                              className={`h-full rounded-full ${kw.density > 2.5 ? 'bg-amber-500' : kw.density < 0.5 ? 'bg-blue-400' : 'bg-emerald-500'}`}
                                                              style={{ width: `${Math.min(kw.density * 10, 100)}%` }} // Scale visual for visibility
                                                          ></div>
                                                      </div>
                                                      <span className={`text-xs font-mono font-bold w-12 text-right ${kw.density > 2.5 ? 'text-amber-500' : 'text-slate-500'}`}>
                                                          {kw.density.toFixed(1)}%
                                                      </span>
                                                  </div>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
                )}

                {/* Issues List */}
                <div id="section-issues" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" /> Audit Findings
                        </h3>
                        <div className="flex gap-1 flex-wrap">
                             {(['ALL', Category.TECHNICAL, Category.CONTENT, Category.UX_MOBILE, Category.AUTHORITY] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wide transition-all ${
                                        activeTab === tab ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {tab.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {filteredIssues.length > 0 ? filteredIssues.map((issue, idx) => (
                            <IssueCard key={idx} issue={issue} onFix={issue.codeFix ? () => setSelectedFix(issue.codeFix!) : undefined} />
                        )) : (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                No issues found in this category. Great job!
                            </div>
                        )}
                    </div>
                </div>

                {/* TECHNICAL SPECS DEEP DIVE */}
                {isWeb && result.specs && (
                    <div id="section-tech_specs" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-indigo-500" /> Technical Specifications Deep Dive
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-6">
                            {/* Meta Tags Section */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> Meta Data Analysis
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TechSpecCard 
                                        label="Title Tag" 
                                        value={result.specs.titleTag} 
                                        count={result.specs.titleLength} 
                                        max={60} 
                                        recommended="Optimal: 50-60 characters" 
                                    />
                                    <TechSpecCard 
                                        label="Meta Description" 
                                        value={result.specs.metaDescription} 
                                        count={result.specs.metaDescriptionLength} 
                                        max={160} 
                                        recommended="Optimal: 150-160 characters" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Structure */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Layout className="w-3 h-3" /> Structure & Headings
                                    </h4>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800 space-y-3">
                                        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">H1 Count</span>
                                            <span className={`font-mono font-bold ${result.specs.h1Count === 1 ? 'text-green-500' : 'text-red-500'}`}>
                                                {result.specs.h1Count}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-slate-500 dark:text-slate-500 font-semibold">H1 Content</span>
                                            <span className="text-xs font-medium text-slate-900 dark:text-white truncate" title={result.specs.h1Content}>
                                                {result.specs.h1Content || 'Missing H1 Tag'}
                                            </span>
                                        </div>
                                        <div className="pt-1 border-t border-slate-200 dark:border-slate-700">
                                            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold block">Target: Exactly 1 H1 per page</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Stats */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Type className="w-3 h-3" /> Content Stats
                                    </h4>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800 space-y-3">
                                        <StatRow label="Word Count" value={result.specs.wordCount} standard="Target: > 300 words" />
                                        <StatRow label="Text/HTML Ratio" value={`${result.specs.textToHtmlRatio}%`} standard="Target: > 15%" />
                                        <StatRow label="Heading Structure" value={result.specs.headingStructure} standard="Target: Sequential" />
                                    </div>
                                </div>

                                {/* Images & Links */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <ImageIcon className="w-3 h-3" /> Assets & Links
                                    </h4>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800 space-y-3">
                                        <StatRow label="Total Images" value={result.specs.imageCount} standard="Target: Compressed < 100KB" />
                                        <StatRow 
                                            label="Missing Alt Text" 
                                            value={result.specs.imagesWithoutAlt} 
                                            highlight={result.specs.imagesWithoutAlt > 0 ? 'text-red-500' : 'text-green-500'}
                                            standard="Target: 0 Missing"
                                        />
                                        <StatRow 
                                            label="Internal Links" 
                                            value={result.specs.internalLinkCount}
                                            standard="Target: 5-20 Links"
                                            tooltipContent={result.specs.linkStats?.internal ? (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px]"><span>Dofollow:</span><span className="font-mono text-green-400">{result.specs.linkStats.internal.dofollow}</span></div>
                                                    <div className="flex justify-between text-[10px]"><span>Nofollow:</span><span className="font-mono text-slate-400">{result.specs.linkStats.internal.nofollow}</span></div>
                                                    <div className="flex justify-between text-[10px]"><span>Broken:</span><span className="font-mono text-red-400">{result.specs.linkStats.internal.broken}</span></div>
                                                </div>
                                            ) : undefined}
                                        />
                                        <StatRow 
                                            label="External Links" 
                                            value={result.specs.externalLinkCount} 
                                            standard="Target: > 2 Links"
                                            tooltipContent={result.specs.linkStats?.external ? (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px]"><span>Dofollow:</span><span className="font-mono text-green-400">{result.specs.linkStats.external.dofollow}</span></div>
                                                    <div className="flex justify-between text-[10px]"><span>Nofollow:</span><span className="font-mono text-slate-400">{result.specs.linkStats.external.nofollow}</span></div>
                                                    <div className="flex justify-between text-[10px]"><span>Broken:</span><span className="font-mono text-red-400">{result.specs.linkStats.external.broken}</span></div>
                                                </div>
                                            ) : undefined}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Technical & Schema */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Database className="w-3 h-3" /> Directives & Tech
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <TechBadge 
                                            label="Canonical Tag" 
                                            value={result.specs.canonicalTag ? 'Present' : 'Missing'} 
                                            subValue={result.specs.canonicalTag || ''}
                                            type={result.specs.canonicalTag ? 'success' : 'error'} 
                                            recommendation="Self-referencing"
                                        />
                                        <TechBadge 
                                            label="Robots Meta" 
                                            value={result.specs.robotsMeta || 'None'} 
                                            type="neutral" 
                                            recommendation="index, follow"
                                        />
                                        <TechBadge 
                                            label="Viewport Tag" 
                                            value={result.specs.viewportMeta ? 'Optimized' : 'Missing'} 
                                            type={result.specs.viewportMeta ? 'success' : 'error'} 
                                            recommendation="width=device-width"
                                        />
                                        <TechBadge 
                                            label="Charset" 
                                            value={result.specs.charset || 'Missing'} 
                                            type={result.specs.charset ? 'neutral' : 'error'} 
                                            recommendation="UTF-8"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Share2 className="w-3 h-3" /> Schema & Social Graph
                                    </h4>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800 h-full">
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-semibold text-slate-500 block">Detected Schema Types</span>
                                                <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold">Recommended: Organization, WebSite</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {result.specs.schemaTypes.length > 0 ? result.specs.schemaTypes.map(s => (
                                                    <span key={s} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded uppercase border border-indigo-200 dark:border-indigo-800">{s}</span>
                                                )) : <span className="text-xs text-slate-400 italic">No Schema Structured Data Found</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-6 pt-3 border-t border-slate-200 dark:border-slate-700">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${result.specs.openGraphTags ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Open Graph</span>
                                                </div>
                                                <span className="text-[9px] text-slate-400 ml-4">Required for FB/LinkedIn</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${result.specs.twitterCard ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Twitter Card</span>
                                                </div>
                                                 <span className="text-[9px] text-slate-400 ml-4">Summary Large Image</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${result.specs.favicon ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Favicon</span>
                                                </div>
                                                <span className="text-[9px] text-slate-400 ml-4">32x32 .ico or .png</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ASO SPECIFICATIONS DEEP DIVE */}
                {!isWeb && result.asoSpecs && (
                    <div id="section-aso_specs" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-fuchsia-500" /> App Store Optimization (ASO) Specs
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-6">
                            {/* Metadata Section */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Type className="w-3 h-3" /> Metadata Analysis
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TechSpecCard 
                                        label="App Name" 
                                        value={result.asoSpecs.appName} 
                                        count={result.asoSpecs.appNameLength} 
                                        max={30} 
                                        recommended="Optimal: 30 characters (iOS)" 
                                    />
                                    <TechSpecCard 
                                        label="Subtitle / Short Desc" 
                                        value={result.asoSpecs.subtitle || result.asoSpecs.shortDescription || 'Missing'} 
                                        count={(result.asoSpecs.subtitle || result.asoSpecs.shortDescription || '').length} 
                                        max={80} 
                                        recommended="Subtitle: 30 (iOS) / Short Desc: 80 (Android)" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Conversion Elements */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Zap className="w-3 h-3" /> Conversion Elements
                                    </h4>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800 space-y-3">
                                        <div className="flex flex-col gap-1 border-b border-slate-200 dark:border-slate-700 pb-2">
                                            <span className="text-xs text-slate-500 font-semibold">Promotional Text</span>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white italic truncate" title={result.asoSpecs.promotionalText || ''}>
                                                {result.asoSpecs.promotionalText || 'None detected'}
                                            </span>
                                            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold">Target: Compelling Hook</span>
                                        </div>
                                        <StatRow 
                                            label="Video Preview" 
                                            value={result.asoSpecs.hasVideoPreview ? 'Present' : 'Missing'} 
                                            highlight={result.asoSpecs.hasVideoPreview ? 'text-green-500' : 'text-amber-500'}
                                            standard="Target: Required for Conversion"
                                        />
                                    </div>
                                </div>

                                {/* Description Stats */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Description
                                    </h4>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800 space-y-3">
                                        <StatRow label="Length" value={`${result.asoSpecs.descriptionLength} chars`} standard="Target: > 1000 chars" />
                                        <StatRow label="Keywords Found" value={result.asoSpecs.keywordsDetected.length} standard="Target: > 10 Keywords" />
                                        <div className="pt-2">
                                            <span className="text-xs font-semibold text-slate-500 block mb-2">Detected Keywords</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {result.asoSpecs.keywordsDetected.slice(0,5).map((k, i) => (
                                                    <span key={i} className="text-[10px] bg-white dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Proof */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Target className="w-3 h-3" /> Social & Updates
                                    </h4>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800 space-y-3">
                                        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Rating</span>
                                            <div className="flex items-center gap-1">
                                                <span className="font-mono font-bold text-slate-900 dark:text-white">{result.asoSpecs.rating}</span>
                                                <span className="text-amber-400 text-xs">★</span>
                                            </div>
                                        </div>
                                        <div className="pt-1 border-b border-slate-200 dark:border-slate-700 pb-2">
                                            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold block text-right">Target: > 4.5</span>
                                        </div>
                                        <StatRow label="Reviews" value={result.asoSpecs.reviewCount.toLocaleString()} standard="Target: > 100" />
                                        <StatRow label="Last Update" value={result.asoSpecs.lastUpdated || 'Unknown'} standard="Target: < 30 days" />
                                        <StatRow label="Version" value={result.asoSpecs.version || 'Unknown'} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT: SIDEBAR (4 COLS) */}
            <div id="section-sidebar" className="lg:col-span-4 space-y-6">
                
                {/* SERP Preview */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
                     <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <Search className="w-4 h-4 text-blue-500" /> {isWeb ? 'Google SERP Preview' : 'App Store Listing Preview'}
                    </h3>
                    {isWeb ? (
                        <div className="bg-white p-4 rounded border border-slate-200 hover:shadow-md transition-shadow cursor-default">
                            <div className="flex items-center gap-2 text-xs text-slate-800 mb-1">
                                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-500 border border-slate-200">
                                    <img src={`https://www.google.com/s2/favicons?domain=${result.url}`} className="w-3 h-3" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">{new URL(result.url).hostname}</span>
                                    <span className="text-[10px] text-slate-500">{result.url}</span>
                                </div>
                            </div>
                            <h4 className="text-lg text-[#1a0dab] hover:underline font-medium cursor-pointer truncate">
                                {result.specs?.titleTag || 'Missing Title Tag'}
                            </h4>
                            <p className="text-sm text-[#4d5156] line-clamp-2 leading-snug">
                                {result.specs?.metaDescription || 'Missing meta description. Google will auto-generate this snippet from page content.'}
                            </p>
                        </div>
                    ) : (
                         <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-default">
                            <div className="flex gap-3">
                                <div className="w-16 h-16 bg-indigo-500 rounded-2xl shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                    {result.asoSpecs?.appName?.[0] || 'A'}
                                </div>
                                <div className="flex flex-col justify-center overflow-hidden">
                                    <h4 className="text-base font-semibold text-slate-900 truncate leading-tight">
                                        {result.asoSpecs?.appName || 'App Name'}
                                    </h4>
                                    <span className="text-xs text-slate-500 truncate mb-1">
                                        {result.asoSpecs?.subtitle || 'App Subtitle'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button className="px-3 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase">Get</button>
                                        <span className="text-[10px] text-slate-400">In-App Purchases</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tech Stack */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
                     <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <Layers className="w-4 h-4 text-indigo-500" /> {isWeb ? 'Tech Stack' : 'SDKs & Libraries'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {result.techStack && result.techStack.map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-md">
                                {tech}
                            </span>
                        ))}
                        {(!result.techStack || result.techStack.length === 0) && <span className="text-slate-400 text-xs">No tech detected</span>}
                    </div>
                </div>

                {/* Content DNA */}
                {result.contentAnalysis && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                            <Fingerprint className="w-4 h-4 text-blue-500" /> Content Analysis
                        </h3>
                        <div className="space-y-3">
                             <div className="flex justify-between text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                                 <span className="text-slate-500">Tone</span>
                                 <span className="font-medium dark:text-white">{result.contentAnalysis.tone}</span>
                             </div>
                             <div className="flex justify-between text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                                 <span className="text-slate-500">Readability</span>
                                 <span className="font-medium dark:text-white">{result.contentAnalysis.readabilityLevel}</span>
                             </div>
                             <div className="mt-4">
                                 <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">Top Keywords</span>
                                 <div className="flex flex-wrap gap-1.5">
                                     {result.contentAnalysis.topEntities.slice(0,8).map((e,i) => (
                                         <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{e}</span>
                                     ))}
                                 </div>
                             </div>
                        </div>
                    </div>
                )}

                {/* Roadmap */}
                <div className="bg-slate-900 dark:bg-black border border-slate-800 rounded-xl shadow-sm p-6 text-white relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-600/30 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-all"></div>
                    <h3 className="font-bold flex items-center gap-2 mb-4 relative z-10">
                        <Zap className="w-4 h-4 text-yellow-400" /> Priority Actions
                    </h3>
                    <div className="space-y-3 relative z-10">
                        {result.roadmap[0]?.tasks.slice(0, 4).map((task, i) => (
                            <div key={i} className="flex gap-3 items-start text-xs border-b border-slate-800 pb-2 last:border-0">
                                <span className="font-mono text-indigo-400 font-bold">0{i+1}</span>
                                <span className="text-slate-300">{task.task}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </div>

      {/* Export Options Modal */}
      {showExportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowExportModal(false)}></div>
              <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                          <Printer className="w-5 h-5 text-indigo-500" /> Export Options
                      </h3>
                      <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Sections to Include</p>
                      {SECTIONS.map((section) => {
                          // Skip sections not relevant to audit type
                          if (section.id === 'tech_specs' && !isWeb) return null;
                          if (section.id === 'aso_specs' && isWeb) return null;

                          const isSelected = selectedSections.includes(section.id);
                          return (
                              <div 
                                  key={section.id} 
                                  onClick={() => toggleSection(section.id)}
                                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                                      isSelected 
                                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' 
                                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                                  }`}
                              >
                                  <span className={`text-sm font-medium ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>{section.label}</span>
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`}>
                                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                  </div>
                              </div>
                          );
                      })}
                  </div>

                  <div className="flex gap-3">
                      <button 
                          onClick={() => setShowExportModal(false)}
                          className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={handleDownloadPDF}
                          disabled={isExporting || selectedSections.length === 0}
                          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                          {isExporting ? 'Generating...' : 'Download PDF'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Modals */}
      {selectedFix && <CodeDiffModal fix={selectedFix} onClose={() => setSelectedFix(null)} />}
      <ChatAssistant context={result} />
    </div>
  );
};

// Helper Components for Specs Section
const TechSpecCard = ({ label, value, count, max, recommended }: { label: string, value: string, count: number, max: number, recommended: string }) => {
    const percentage = Math.min((count / max) * 100, 100);
    const isOptimal = count >= max * 0.8 && count <= max;
    
    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                <span className={`text-xs font-mono ${isOptimal ? 'text-green-500' : 'text-amber-500'}`}>{count} / {max} chars</span>
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-white truncate leading-relaxed" title={value}>
                {value || 'Missing'}
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                <div 
                    className={`h-full rounded-full ${isOptimal ? 'bg-green-500' : count > max ? 'bg-red-500' : 'bg-amber-500'}`} 
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-[10px] text-slate-400">{recommended}</span>
        </div>
    );
};

const StatRow = ({ label, value, highlight, tooltipContent, standard }: { label: string, value: string | number, highlight?: string, tooltipContent?: React.ReactNode, standard?: string }) => (
    <div className="group relative flex flex-col border-b border-slate-200 dark:border-slate-700 pb-2 last:border-0 last:pb-0">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 cursor-help">
                <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                {tooltipContent && <HelpCircle className="w-3 h-3 text-slate-300 dark:text-slate-600" />}
            </div>
            <span className={`font-mono font-bold text-sm ${highlight || 'text-slate-900 dark:text-white'}`}>{value}</span>
        </div>
        {standard && (
             <div className="flex justify-end mt-0.5">
                <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold">{standard}</span>
             </div>
        )}
        
        {tooltipContent && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 dark:bg-white border border-slate-800 dark:border-slate-200 text-white dark:text-slate-900 text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 hidden group-hover:block">
                {tooltipContent}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-white"></div>
            </div>
        )}
    </div>
);

const TechBadge = ({ label, value, subValue, type, recommendation }: { label: string, value: string, subValue?: string, type: 'success' | 'error' | 'neutral', recommendation?: string }) => {
    const colors = {
        success: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-300',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-300',
        neutral: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
    };
    return (
        <div className={`p-3 rounded-lg border ${colors[type]} flex flex-col justify-center`}>
            <span className="text-[10px] uppercase font-bold opacity-70 mb-1">{label}</span>
            <span className="text-sm font-bold truncate" title={subValue}>{value}</span>
            {recommendation && <span className="text-[9px] mt-1 opacity-70">Rec: {recommendation}</span>}
        </div>
    );
};

const IssueCard: React.FC<{ issue: SeoIssue, onFix?: () => void }> = ({ issue, onFix }) => {
    const [expanded, setExpanded] = useState(false);
    
    const severityConfig = {
        CRITICAL: {
            icon: AlertOctagon,
            text: 'text-red-700 dark:text-red-400',
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            accent: 'border-l-red-600',
            iconBg: 'bg-red-100 dark:bg-red-900/30'
        },
        WARNING: {
            icon: AlertTriangle,
            text: 'text-amber-700 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-200 dark:border-amber-800',
            accent: 'border-l-amber-500',
            iconBg: 'bg-amber-100 dark:bg-amber-900/30'
        },
        INFO: {
            icon: Info,
            text: 'text-blue-700 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800',
            accent: 'border-l-blue-500',
            iconBg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        GOOD: {
            icon: CheckCircle2,
            text: 'text-emerald-700 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-200 dark:border-emerald-800',
            accent: 'border-l-emerald-500',
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/30'
        }
    };

    const config = severityConfig[issue.severity as keyof typeof severityConfig] || severityConfig.INFO;
    const Icon = config.icon;

    return (
        <div className={`group bg-white dark:bg-slate-900 border-l-[4px] ${config.accent} transition-all duration-200 border-b border-slate-100 dark:border-slate-800 last:border-b-0`}>
            {/* Header Clickable */}
            <div className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 flex items-start gap-4">
                        {/* Distinct Icon Box */}
                        <div className={`p-2 rounded-lg ${config.iconBg} shrink-0 mt-0.5`}>
                            <Icon className={`w-5 h-5 ${config.text}`} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5">{issue.title}</h4>
                             <div className="flex items-center gap-2">
                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>
                                    {issue.severity}
                                </span>
                                <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                                <span className="text-[10px] text-slate-500 uppercase font-semibold">{issue.category}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {issue.codeFix && (
                             <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-900/30">
                                <Code2 className="w-3 h-3" /> Fix
                             </span>
                        )}
                        <div className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
                             <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Expanded Content Accordion */}
            <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-4 pb-6 pt-0 pl-[4.5rem]"> {/* Indent content to align with title */}
                        {/* Main Description */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mb-6">
                             <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {issue.description}
                            </p>
                        </div>

                        {/* Impact Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Target className="w-3 h-3 text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business Impact</span>
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white block">{issue.impact || 'Moderate Impact on Ranking'}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fix Effort</span>
                                </div>
                                <span className={`text-sm font-bold ${issue.effort === 'HIGH' ? 'text-red-500' : issue.effort === 'MEDIUM' ? 'text-amber-500' : 'text-green-500'}`}>
                                    {issue.effort || 'Medium'}
                                </span>
                            </div>
                        </div>

                        {/* Recommendation Box */}
                        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/20 overflow-hidden">
                             <div className="px-4 py-3 border-b border-indigo-100 dark:border-indigo-900/20 bg-indigo-100/20 dark:bg-indigo-900/20 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">AI Recommendation</span>
                             </div>
                             
                             <div className="p-4">
                                 <p className="text-sm text-slate-800 dark:text-slate-200 mb-4 leading-relaxed">
                                    {issue.recommendation}
                                 </p>

                                 {/* Code Fix Preview */}
                                 {issue.codeFix && (
                                     <div className="mb-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
                                         <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                            <span className="text-indigo-500 font-bold select-none mr-2">{'>'} Technical Strategy:</span>
                                            {issue.codeFix.explanation}
                                         </p>
                                     </div>
                                 )}

                                 {/* Action Button */}
                                 {onFix && (
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); onFix(); }}
                                        className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-all shadow-md shadow-indigo-500/20 hover:translate-y-[-1px]"
                                     >
                                        <Code2 className="w-4 h-4" />
                                        View Implementation Details
                                     </button>
                                 )}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
