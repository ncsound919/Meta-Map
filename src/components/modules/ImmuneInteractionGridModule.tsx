import React, { useState, lazy, Suspense } from 'react';
import {
  Shield,
  Activity,
  Layers,
  Crosshair,
  Grid,
  ShieldAlert,
  BarChart3,
  FlaskConical
} from 'lucide-react';

const ImmuneInteractionMatrix = lazy(() => import('./immune/ImmuneInteractionMatrix').then(m => ({ default: m.ImmuneInteractionMatrix })));
const InterventionScenarioSim = lazy(() => import('./immune/InterventionScenarioSim').then(m => ({ default: m.InterventionScenarioSim })));
const ImmuneSynapseCanvas = lazy(() => import('./immune/ImmuneSynapseCanvas').then(m => ({ default: m.ImmuneSynapseCanvas })));
const SpatialImmuneTopology = lazy(() => import('./immune/SpatialImmuneTopology').then(m => ({ default: m.SpatialImmuneTopology })));
const ImmuneEscapeMechanisms = lazy(() => import('./immune/ImmuneEscapeMechanisms').then(m => ({ default: m.ImmuneEscapeMechanisms })));
const SpatialAgentSimulator = lazy(() => import('./immune/SpatialAgentSimulator').then(m => ({ default: m.SpatialAgentSimulator })));
const ImmuneBiomarkerPredictor = lazy(() => import('./immune/ImmuneBiomarkerPredictor').then(m => ({ default: m.ImmuneBiomarkerPredictor })));

type GridTabId = 'matrix' | 'simulator' | 'agent_sim' | 'synapse' | 'escape' | 'topology' | 'biomarkers';

export const ImmuneInteractionGridModule: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState<GridTabId>('matrix');

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
        <div 
          role="tablist"
          aria-label="Immune simulation modules"
          className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto min-w-max sm:min-w-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'matrix'}
            aria-controls="panel-matrix"
            id="tab-matrix"
            tabIndex={activeTab === 'matrix' ? 0 : -1}
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> TME Grid
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'simulator'}
            aria-controls="panel-simulator"
            id="tab-simulator"
            tabIndex={activeTab === 'simulator' ? 0 : -1}
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" /> 180D Trials Sim
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'agent_sim'}
            aria-controls="panel-agent_sim"
            id="tab-agent_sim"
            tabIndex={activeTab === 'agent_sim' ? 0 : -1}
            onClick={() => setActiveTab('agent_sim')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'agent_sim'
                ? 'bg-indigo-500 text-slate-950 shadow-md shadow-indigo-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Spatial Agent Physics
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'synapse'}
            aria-controls="panel-synapse"
            id="tab-synapse"
            tabIndex={activeTab === 'synapse' ? 0 : -1}
            onClick={() => setActiveTab('synapse')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'synapse'
                ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" /> Synapse & Lysis
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'escape'}
            aria-controls="panel-escape"
            id="tab-escape"
            tabIndex={activeTab === 'escape' ? 0 : -1}
            onClick={() => setActiveTab('escape')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'escape'
                ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Escape Pathways
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'topology'}
            aria-controls="panel-topology"
            id="tab-topology"
            tabIndex={activeTab === 'topology' ? 0 : -1}
            onClick={() => setActiveTab('topology')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'topology'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Spatial Topology
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'biomarkers'}
            aria-controls="panel-biomarkers"
            id="tab-biomarkers"
            tabIndex={activeTab === 'biomarkers' ? 0 : -1}
            onClick={() => setActiveTab('biomarkers')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
      <div 
        role="tabpanel" 
        id={`panel-${activeTab}`} 
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
        className="outline-none"
      >
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
            <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
            <p className="text-[10px] font-mono font-bold text-cyan-300 tracking-wider uppercase">Loading Immune Grid...</p>
          </div>
        }>
          {activeTab === 'matrix' && <ImmuneInteractionMatrix />}
          {activeTab === 'simulator' && <InterventionScenarioSim />}
          {activeTab === 'agent_sim' && <SpatialAgentSimulator />}
          {activeTab === 'synapse' && <ImmuneSynapseCanvas />}
          {activeTab === 'escape' && <ImmuneEscapeMechanisms />}
          {activeTab === 'topology' && <SpatialImmuneTopology />}
          {activeTab === 'biomarkers' && <ImmuneBiomarkerPredictor />}
        </Suspense>
      </div>
    </div>
  );
});

ImmuneInteractionGridModule.displayName = 'ImmuneInteractionGridModule';
