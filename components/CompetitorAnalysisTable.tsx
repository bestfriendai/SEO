
import React from 'react';
import { Competitor } from '../types';
import { TrendingUp, ExternalLink, ArrowUpRight, Info, Trophy, Medal } from 'lucide-react';

interface Props {
  competitors: Competitor[];
  me: string; // Current URL
}

export const CompetitorAnalysisTable: React.FC<Props> = ({ competitors, me }) => {
  // Calculate max values for relative bars
  const maxDA = Math.max(...competitors.map(c => c.metrics?.domainAuthority || 0), 100);
  const maxTraffic = Math.max(...competitors.map(c => c.metrics?.monthlyTraffic || 0), 1000);
  const maxKeywords = Math.max(...competitors.map(c => c.metrics?.organicKeywords || 0), 100);
  const maxBacklinks = Math.max(...competitors.map(c => c.metrics?.backlinks || 0), 100);

  // Calculate Traffic Ranks
  const sortedByTraffic = [...competitors].sort((a, b) => (b.metrics?.monthlyTraffic || 0) - (a.metrics?.monthlyTraffic || 0));
  const getRank = (compName: string) => sortedByTraffic.findIndex(c => c.name === compName) + 1;

  const MetricCell = ({ value, max, color, tooltip }: { value: number, max: number, color: string, tooltip: string }) => {
    const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
      <div className="w-full group relative min-w-[100px]">
         <div className="flex justify-end items-baseline gap-1 mb-1.5">
            <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{value?.toLocaleString() || 0}</span>
         </div>
         <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
                className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} 
                style={{ width: `${percent}%` }} 
            />
         </div>
         {/* Tooltip */}
         <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 hidden group-hover:block">
            <div className="font-bold mb-1">{tooltip}</div>
            <div className="font-mono opacity-80">Value: {value?.toLocaleString()}</div>
         </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs w-16">Rank</th>
            <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Domain</th>
            <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right group cursor-help relative">
                <div className="flex items-center justify-end gap-1" title="Predicts how well a website will rank on search engines (0-100)">
                    Auth Score <Info className="w-3 h-3" />
                </div>
            </th>
            <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">
                <div className="flex items-center justify-end gap-1" title="Estimated monthly organic traffic">
                    Est. Traffic <Info className="w-3 h-3" />
                </div>
            </th>
            <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">
                <div className="flex items-center justify-end gap-1" title="Number of keywords ranking in top 100">
                    Keywords <Info className="w-3 h-3" />
                </div>
            </th>
            <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">
                <div className="flex items-center justify-end gap-1" title="Number of links from other sites">
                    Backlinks <Info className="w-3 h-3" />
                </div>
            </th>
            <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Top Opportunity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {competitors.map((comp, idx) => {
            const rank = getRank(comp.name);
            let rankIcon = null;
            let rankClass = "bg-slate-100 dark:bg-slate-800 text-slate-500";
            
            if (rank === 1) {
                rankIcon = <Trophy className="w-3 h-3" />;
                rankClass = "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
            } else if (rank === 2) {
                rankIcon = <Medal className="w-3 h-3" />;
                rankClass = "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600";
            } else if (rank === 3) {
                rankIcon = <Medal className="w-3 h-3" />;
                rankClass = "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-800";
            }

            return (
            <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${rankClass} shadow-sm`}>
                      {rankIcon || <span>#{rank}</span>}
                  </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        {comp.name}
                        <a href={comp.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-500 transition-colors"><ExternalLink className="w-3 h-3" /></a>
                    </div>
                    <span className="text-xs text-slate-500">{new URL(comp.url).hostname}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right align-top">
                <MetricCell 
                    value={comp.metrics?.domainAuthority || 0} 
                    max={100} 
                    color="bg-fuchsia-500" 
                    tooltip="Domain Authority"
                />
              </td>
              <td className="px-6 py-4 text-right align-top">
                <MetricCell 
                    value={comp.metrics?.monthlyTraffic || 0} 
                    max={maxTraffic} 
                    color="bg-indigo-500" 
                    tooltip="Monthly Visits"
                />
              </td>
              <td className="px-6 py-4 text-right align-top">
                <MetricCell 
                    value={comp.metrics?.organicKeywords || 0} 
                    max={maxKeywords} 
                    color="bg-blue-500" 
                    tooltip="Ranking Keywords"
                />
              </td>
               <td className="px-6 py-4 text-right align-top">
                 <MetricCell 
                    value={comp.metrics?.backlinks || 0} 
                    max={maxBacklinks} 
                    color="bg-amber-500" 
                    tooltip="Total Backlinks"
                />
              </td>
              <td className="px-6 py-4 align-top">
                {comp.metrics?.topKeywords && comp.metrics.topKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {comp.metrics.topKeywords.slice(0, 2).map((k, i) => (
                             <span key={i} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase border border-slate-200 dark:border-slate-700">
                                {k}
                             </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-slate-400 text-xs">-</span>
                )}
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
};
