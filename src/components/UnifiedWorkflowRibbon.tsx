import React from 'react';
import {
  Stethoscope,
  Brain,
  Cpu,
  HelpCircle,
  Swords,
  Network,
  Workflow,
  ArrowRight,
  Activity,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface UnifiedWorkflowRibbonProps {
  activeModule: string;
  setActiveModule: (moduleId: string) => void;
  selectedOrgan: string;
  selectedCancerType: string;
}

export const UnifiedWorkflowRibbon: React.FC<UnifiedWorkflowRibbonProps> = ({
  activeModule,
  setActiveModule,
  selectedOrgan,
  selectedCancerType
}) => {
  const workflowSteps = [
    {
      id: 'proactive_interception',
      number: '1',
      title: 'Proactive Interception',
      subtitle: 'Early Telemetry & ctDNA',
      icon: Stethoscope,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'forecast_engine',
      number: '2',
      title: '4-Layer Forecast Engine',
      subtitle: 'Probabilistic Fan Charts',
      icon: Brain,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'cascade_twin',
      number: '3',
      title: 'Cascade Twin Simulator',
      subtitle: 'Microfluidics & Chips',
      icon: Cpu,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'causal_oracle',
      number: '4',
      title: 'Causal Oracle',
      subtitle: 'DAG Counterfactuals',
      icon: HelpCircle,
      color: 'from-purple-500 to-fuchsia-500'
    },
    {
      id: 'resistance_forge',
      number: '5',
      title: 'Resistance Forge',
      subtitle: 'Synthetic Lethality',
      icon: Swords,
      color: 'from-fuchsia-500 to-rose-500'
    },
    {
      id: 'ontology',
      number: '6',
      title: 'Ontology Graph',
      subtitle: 'MPO & Bio-Knowledge',
      icon: Network,
      color: 'from-rose-500 to-amber-500'
    },
    {
      id: 'sim_pipeline',
      number: '7',
      title: 'Simulation Pipeline',
      subtitle: '10-Step Execution',
      icon: Workflow,
      color: 'from-amber-500 to-emerald-500'
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-6 shadow-xl backdrop-blur-md">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
          </span>
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            End-to-End Metastasis Interception Workflow Pipeline
          </span>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            Unified Patient Twin Sync
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="text-slate-500">Organ Niche:</span>
            <strong className="text-cyan-300 uppercase">{selectedOrgan}</strong>
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <span className="text-slate-500">Cancer:</span>
            <strong className="text-indigo-300">{selectedCancerType}</strong>
          </span>
        </div>
      </div>

      {/* Connected 7-Step Workflow Navigation Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {workflowSteps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeModule === step.id;

          return (
            <button
              key={step.id}
              onClick={() => setActiveModule(step.id)}
              className={`p-2.5 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col justify-between group ${
                isActive
                  ? 'bg-slate-800 border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/60 border-slate-800/90 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              {/* Active Gradient Top Accent */}
              {isActive && (
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`} />
              )}

              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-900 text-slate-400'
                }`}>
                  STEP {step.number}
                </span>

                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              </div>

              <div>
                <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                  {step.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
