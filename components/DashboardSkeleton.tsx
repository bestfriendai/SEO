
import React from 'react';

export const DashboardSkeleton = () => {
  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl animate-pulse">
      {/* KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         {[1,2,3,4].map(i => (
             <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"></div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Main */}
        <div className="lg:col-span-8 space-y-6">
             {/* Competitor Table */}
             <div className="h-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"></div>
             
             {/* Charts */}
             <div className="grid grid-cols-2 gap-6">
                 <div className="h-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"></div>
                 <div className="h-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"></div>
             </div>

             {/* Issues */}
             <div className="space-y-2">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-16 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"></div>
                ))}
             </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
             {[1,2,3,4].map(i => (
                 <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"></div>
             ))}
        </div>
      </div>
    </div>
  );
};
