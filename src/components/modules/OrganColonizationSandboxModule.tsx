import React, { useState } from 'react';
import {
  Bone,
  Brain,
  Activity,
  Wind,
  Droplets,
  Layers,
  Sparkles,
  Shield,
  Zap,
  RotateCcw,
  Download,
  Info,
  Sliders,
  Globe,
  ArrowRight
} from 'lucide-react';
import { OrganSite, PrimaryCancerType } from '../../types/metastasis';
import { BoneNicheEngine } from './colonization/BoneNicheEngine';
import { BrainNicheEngine } from './colonization/BrainNicheEngine';
import { LiverNicheEngine } from './colonization/LiverNicheEngine';
import { LungNicheEngine } from './colonization/LungNicheEngine';
import { LiveNicheCanvas } from './colonization/LiveNicheCanvas';
import { OrganotropismMatrixViewer } from './colonization/OrganotropismMatrixViewer';

interface OrganColonizationSandboxModuleProps {
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
  onNavigateModule?: (moduleId: string, organ?: string) => void;
}

export const OrganColonizationSandboxModule: React.FC<OrganColonizationSandboxModuleProps> = ({
  selectedOrgan: initialOrgan,
  selectedCancerType,
  onNavigateModule
}) => {
  const [activeTab, setActiveTab] = useState<'bone' | 'brain' | 'liver' | 'lung' | 'canvas' | 'tropism_matrix'>(
    initialOrgan === 'bone' ? 'bone' :
    initialOrgan === 'brain' ? 'brain' :
    initialOrgan === 'liver' ? 'liver' :
    initialOrgan === 'lung' ? 'lung' : 'bone'
  );

  const [currentOrgan, setCurrentOrgan] = useState<OrganSite>(
    initialOrgan !== 'all' ? initialOrgan : 'bone'
  );

  const handleSelectOrganTab = (organ: 'bone' | 'brain' | 'liver' | 'lung') => {
    setActiveTab(organ);
    setCurrentOrgan(organ);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Module Branding */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 shadow-md">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Organ-Specific Colonization Sandbox
              </h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                PAGET SEED-AND-SOIL 2.0
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Biophysical & biochemical multi-scale sandbox simulating organotropic micromilieu arrest, endosteal vicious loops,
              blood-brain barrier penetration, hepatic sinusoidal desmoplasia, and pulmonary neutrophil extracellular trap (NET) awakening kinetics.
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {onNavigateModule && (
              <button
                onClick={() => onNavigateModule('circulatory_sim', currentOrgan)}
                className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-1.5"
              >
                <span>Circulatory Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onNavigateModule && (
              <button
                onClick={() => onNavigateModule('tumor_evolution_math', currentOrgan)}
                className="px-3 py-2 rounded-xl border border-indigo-700/60 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 transition-all flex items-center gap-1.5"
              >
                <span>Tumor Math Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Organ Niche Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => handleSelectOrganTab('bone')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
              activeTab === 'bone'
                ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-lg shadow-amber-950/50'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Bone className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-xs font-bold font-mono">Bone Niche</div>
              <div className="text-[10px] text-slate-400">Vicious Cycle & Resorption</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectOrganTab('brain')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
              activeTab === 'brain'
                ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200 shadow-lg shadow-indigo-950/50'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-xs font-bold font-mono">Brain Niche</div>
              <div className="text-[10px] text-slate-400">NVU & Astrocytic Shield</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectOrganTab('liver')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
              activeTab === 'liver'
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-950/50'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Droplets className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-xs font-bold font-mono">Liver Niche</div>
              <div className="text-[10px] text-slate-400">Sinusoids & Desmoplasia</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectOrganTab('lung')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
              activeTab === 'lung'
                ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 shadow-lg shadow-cyan-950/50'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Wind className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-xs font-bold font-mono">Lung Niche</div>
              <div className="text-[10px] text-slate-400">NET Awakening & TSP-1</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('canvas')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
              activeTab === 'canvas'
                ? 'bg-purple-950/70 border-purple-500 text-purple-200 shadow-lg shadow-purple-950/50'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-xs font-bold font-mono">Live 2D Canvas</div>
              <div className="text-[10px] text-slate-400">Multi-Agent Physics</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('tropism_matrix')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
              activeTab === 'tropism_matrix'
                ? 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-lg shadow-rose-950/50'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 text-rose-400" />
            <div>
              <div className="text-xs font-bold font-mono">Tropism Matrix</div>
              <div className="text-[10px] text-slate-400">Cross-Cancer Profile</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'bone' && <BoneNicheEngine />}
      {activeTab === 'brain' && <BrainNicheEngine />}
      {activeTab === 'liver' && <LiverNicheEngine />}
      {activeTab === 'lung' && <LungNicheEngine />}
      {activeTab === 'canvas' && (
        <LiveNicheCanvas
          selectedOrgan={currentOrgan}
        />
      )}
      {activeTab === 'tropism_matrix' && (
        <OrganotropismMatrixViewer
          selectedOrgan={currentOrgan}
          onSelectOrgan={(organ) => {
            setCurrentOrgan(organ);
            setActiveTab(organ as any);
          }}
          selectedCancerType={selectedCancerType}
        />
      )}
    </div>
  );
};
