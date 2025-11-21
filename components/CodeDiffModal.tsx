
import React from 'react';
import { CodeFix } from '../types';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CodeDiffModalProps {
  fix: CodeFix;
  onClose: () => void;
}

export const CodeDiffModal: React.FC<CodeDiffModalProps> = ({ fix, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <code className="text-indigo-600 dark:text-indigo-400 text-lg">diff_check</code>
                <span>Intelligent Code Fix</span>
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
            </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    {fix.explanation}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {/* Before */}
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-red-500 uppercase mb-2 tracking-wider px-2">Current / Problematic</span>
                    <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 h-full overflow-x-auto">
                        <pre className="text-xs font-mono text-red-700 dark:text-red-300 whitespace-pre-wrap">{fix.current}</pre>
                    </div>
                </div>

                {/* Arrow Mobile */}
                <div className="md:hidden flex justify-center">
                    <ArrowRight className="rotate-90 text-slate-300" />
                </div>

                {/* After */}
                <div className="flex flex-col">
                     <span className="text-xs font-bold text-green-500 uppercase mb-2 tracking-wider px-2">Optimized</span>
                     <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl p-4 h-full overflow-x-auto">
                        <pre className="text-xs font-mono text-green-700 dark:text-green-300 whitespace-pre-wrap">{fix.optimized}</pre>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                Cancel
            </button>
            <button 
                onClick={() => {
                    navigator.clipboard.writeText(fix.optimized);
                    onClose();
                }}
                className="px-6 py-2 text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
            >
                Copy Optimized Code
            </button>
        </div>
      </div>
    </div>
  );
};