import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Activity,
  Sliders,
  Flame,
  Layers,
  Crosshair,
  Sparkles,
  Info,
  ChevronRight,
  FlaskConical,
  Grid,
  ShieldAlert,
  BarChart3,
  Dna
} from 'lucide-react';
import { ImmuneInteractionMatrix } from './immune/ImmuneInteractionMatrix';
import { InterventionScenarioSim } from './immune/InterventionScenarioSim';
import { ImmuneSynapseCanvas } from './immune/ImmuneSynapseCanvas';
import { SpatialImmuneTopology } from './immune/SpatialImmuneTopology';
import { ImmuneEscapeMechanisms } from './immune/ImmuneEscapeMechanisms';
import { SpatialAgentSimulator } from './immune/SpatialAgentSimulator';
import { ImmuneBiomarkerPredictor } from './immune/ImmuneBiomarkerPredictor';

export const ImmuneInteractionGridModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'matrix' | 'simulator' | 'agent_sim' | 'synapse' | 'escape' | 'topology' | 'biomarkers'
  >('matrix');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Module Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Immune Interaction Grid & Multi-Arm Interventional Simulation Suite
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Multi-Node TME Matrix • 180-Day Kinetic ODEs • 2D Spatial Agent Physics • Escape Pathways • Multi-Omic Biomarker Engine
              </p>
            </div>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> TME Grid
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" /> 180D Trials Sim
          </button>

          <button
            onClick={() => setActiveTab('agent_sim')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'agent_sim'
                ? 'bg-indigo-500 text-slate-950 shadow-md shadow-indigo-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Spatial Agent Physics
          </button>

          <button
            onClick={() => setActiveTab('synapse')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'synapse'
                ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" /> Synapse & Lysis
          </button>

          <button
            onClick={() => setActiveTab('escape')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'escape'
                ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Escape Pathways
          </button>

          <button
            onClick={() => setActiveTab('topology')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'topology'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Spatial Topology
          </button>

          <button
            onClick={() => setActiveTab('biomarkers')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'biomarkers'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Multi-Omic Predictor
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'matrix' && <ImmuneInteractionMatrix />}
      {activeTab === 'simulator' && <InterventionScenarioSim />}
      {activeTab === 'agent_sim' && <SpatialAgentSimulator />}
      {activeTab === 'synapse' && <ImmuneSynapseCanvas />}
      {activeTab === 'escape' && <ImmuneEscapeMechanisms />}
      {activeTab === 'topology' && <SpatialImmuneTopology />}
      {activeTab === 'biomarkers' && <ImmuneBiomarkerPredictor />}
    </div>
  );
};
