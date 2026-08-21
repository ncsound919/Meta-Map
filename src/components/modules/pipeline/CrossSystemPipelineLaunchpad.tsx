import React from 'react';
import { Sparkles, Film, Cpu, Brain, Swords, Stethoscope, Play } from 'lucide-react';

interface CrossSystemPipelineLaunchpadProps {
  onNavigateModule?: (moduleId: string, organ?: string) => void;
  targetOrgan: string;
}

export const CrossSystemPipelineLaunchpad: React.FC<CrossSystemPipelineLaunchpadProps> = ({
  onNavigateModule,
  targetOrgan
}) => {
  if (!onNavigateModule) return null;

  return (
    <div className="bg-slate-900 border border-cyan-500/30 p-5 rounded-2xl space-y-4 shadow-lg">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Sparkles className="w-5 h-5 text-cyan-400" />
        <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wide">
          Cross-System Pipeline Integration Launchpad
        </h3>
      </div>

      <p className="text-xs text-slate-300">
        Wire parameters from this multiscale simulation directly into MetaMap's specialized diagnostic and forecasting modules:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
        <button
          onClick={() => onNavigateModule('living_cinema', targetOrgan)}
          className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1.5 text-center text-slate-200 transition-colors"
        >
          <Film className="w-4 h-4 text-cyan-400" />
          <span>Living Cinema</span>
        </button>

        <button
          onClick={() => onNavigateModule('cascade_twin', targetOrgan)}
          className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1.5 text-center text-slate-200 transition-colors"
        >
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Cascade Twin</span>
        </button>

        <button
          onClick={() => onNavigateModule('forecast_engine', targetOrgan)}
          className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1.5 text-center text-slate-200 transition-colors"
        >
          <Brain className="w-4 h-4 text-emerald-400" />
          <span>Forecast Engine</span>
        </button>

        <button
          onClick={() => onNavigateModule('resistance_forge', targetOrgan)}
          className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1.5 text-center text-slate-200 transition-colors"
        >
          <Swords className="w-4 h-4 text-amber-400" />
          <span>Resistance Forge</span>
        </button>

        <button
          onClick={() => onNavigateModule('proactive_interception', targetOrgan)}
          className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1.5 text-center text-slate-200 transition-colors"
        >
          <Stethoscope className="w-4 h-4 text-rose-400" />
          <span>Interception</span>
        </button>

        <button
          onClick={() => onNavigateModule('workflow')}
          className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1.5 text-center text-slate-200 transition-colors"
        >
          <Play className="w-4 h-4 text-cyan-400" />
          <span>HPC Workflow</span>
        </button>
      </div>
    </div>
  );
};
