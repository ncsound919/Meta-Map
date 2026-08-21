import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

interface ParameterGlobalSensitivityTornadoProps {
  tornadoData: Array<{
    parameter: string;
    impactOnRiskPct: number;
    direction: string;
  }>;
}

export const ParameterGlobalSensitivityTornado: React.FC<ParameterGlobalSensitivityTornadoProps> = ({
  tornadoData
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wide flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" /> Parameter Global Sensitivity Tornado Analysis
        </h3>
        <span className="text-[10px] font-mono text-slate-400">Sobol Global Sensitivity Indices ($S_i$)</span>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={tornadoData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" unit="%" label={{ value: 'Sensitivity Impact on Metastatic Risk (%)', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 10 }} />
            <YAxis type="category" dataKey="parameter" stroke="#94a3b8" width={200} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
            <Bar dataKey="impactOnRiskPct" name="Risk Impact (%)" fill="#38bdf8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
