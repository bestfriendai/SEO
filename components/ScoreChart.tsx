import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ScoreChartProps {
  score: number;
  label?: string;
  size?: 'sm' | 'lg';
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ score, label = "Score", size = 'lg' }) => {
  const data = [
    { name: 'Score', value: score, fill: score > 80 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444' }
  ];

  return (
    <div className={`relative ${size === 'lg' ? 'h-48 w-48' : 'h-24 w-24'} mx-auto`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="80%" 
          outerRadius="100%" 
          barSize={10} 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: 'var(--tw-prose-invert-bg, #e2e8f0)' }} // Fallback, we will override via class
            dataKey="value"
            cornerRadius={30}
            className="stroke-transparent"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className={`${size === 'lg' ? 'text-5xl' : 'text-xl'} font-bold text-slate-900 dark:text-white tracking-tighter`}>{score}</span>
        {size === 'lg' && <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">{label}</span>}
      </div>
    </div>
  );
};