
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Competitor, CategoryScores } from '../types';

interface Props {
  me: CategoryScores;
  competitors: Competitor[];
}

export const CompetitorRadar: React.FC<Props> = ({ me, competitors }) => {
  // Transform data for Recharts Radar
  // We need data structure: [{ subject: 'Tech', A: 120, B: 110, fullMark: 150 }, ...]
  
  const data = [
    { subject: 'Technical', Me: me.technical, ...competitors.reduce((acc, c) => ({...acc, [c.name]: c.scores?.technical || 50}), {}) },
    { subject: 'Content', Me: me.content, ...competitors.reduce((acc, c) => ({...acc, [c.name]: c.scores?.content || 50}), {}) },
    { subject: 'UX/Mobile', Me: me.ux, ...competitors.reduce((acc, c) => ({...acc, [c.name]: c.scores?.ux || 50}), {}) },
    { subject: 'Authority', Me: me.authority, ...competitors.reduce((acc, c) => ({...acc, [c.name]: c.scores?.authority || 50}), {}) },
  ];

  const colors = ['#4f46e5', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="h-[300px] w-full -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#94a3b8" strokeOpacity={0.2} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          
          <Radar
            name="Me"
            dataKey="Me"
            stroke="#4f46e5"
            strokeWidth={2}
            fill="#4f46e5"
            fillOpacity={0.3}
          />
          
          {competitors.slice(0, 2).map((comp, idx) => (
             <Radar
                key={comp.name}
                name={comp.name}
                dataKey={comp.name}
                stroke={colors[idx+1]}
                strokeWidth={2}
                fill={colors[idx+1]}
                fillOpacity={0.1}
             />
          ))}
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};