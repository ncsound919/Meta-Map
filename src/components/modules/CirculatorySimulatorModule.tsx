import React, { useState } from 'react';
import {
  Heart,
  Radio,
  GitBranch,
  Layers,
  Cpu,
  Droplets,
  Activity,
  Zap,
  Info,
  Shield,
  ArrowRight,
  Sparkles,
  ExternalLink,
  BookOpen,
  Filter,
  Network
} from 'lucide-react';
import { OrganSite, PrimaryCancerType } from '../../types/metastasis';
import { Windkessel0DViewer } from './circulatory/Windkessel0DViewer';
import { WavePropagation1DViewer } from './circulatory/WavePropagation1DViewer';
import { MultiphysicsCFD3DViewer } from './circulatory/MultiphysicsCFD3DViewer';
import { BenchtopMockLoopViewer } from './circulatory/BenchtopMockLoopViewer';
import { CirculatoryMicrodynamicsStage } from './circulatory/CirculatoryMicrodynamicsStage';
import { OrganVascularBedFiltration } from './circulatory/OrganVascularBedFiltration';
import { ExtravasationAdhesionKinetics } from './circulatory/ExtravasationAdhesionKinetics';
import { BifurcationHemodynamicsSimulator } from './circulatory/BifurcationHemodynamicsSimulator';

interface CirculatorySimulatorProps {
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
  onNavigateModule?: (moduleId: string, organ?: string) => void;
}

export const CirculatorySimulatorModule: React.FC<CirculatorySimulatorProps> = ({
  selectedOrgan,
  selectedCancerType,
  onNavigateModule
}) => {
  // Navigation Tabs for the Core Modeling Frameworks:
  // 1. CTC Microvascular Transport
  // 2. Organ-Specific Vascular Beds & Steric Filtration
  // 3. Extravasation & Bell's Catch-Bond Adhesion Kinetics
  // 4. Microvascular Bifurcation & Skimming Physics
  // 5. 0D Lumped-Parameter (Windkessel / CVSim / Harvi)
  // 6. 1D Wave Propagation (Pulse reflection / CARDIOSIM)
  // 7. 3D Multiphysics CFD & FSI (SimVascular / OpenFOAM / FFR)
  // 8. Benchtop Mock Circulatory Loops (LVAD / TAH / Valves)
  const [activeTab, setActiveTab] = useState<
    | 'microdynamics'
    | 'organ_beds'
    | 'extravasation'
    | 'bifurcation'
    | '0d_windkessel'
    | '1d_wave'
    | '3d_cfd'
    | 'benchtop_mcl'
  >('microdynamics');

  return (
    <div className="space-y-6" id="circulatory-simulator-module">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-10 w-60 h-60 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Heart className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-400">
                Computational & Physical Cardiovascular Fluid Dynamics
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Circulatory Simulator & Hemodynamic Modeling Suite
            </h2>
            <p className="text-slate-400 text-sm max-w-3xl mt-1">
              Multi-scale cardiovascular simulation platform spanning organ-specific capillary filtration beds,
              Bell's catch-slip extravasation mechanics, bifurcation skimming, 0D Windkessel lumped parameters,
              1D pulse wave propagation, patient-specific 3D CFD/FSI meshes, and in vitro benchtop mock loops.
            </p>
          </div>

          {/* Quick Engine Switcher & Module Navigator */}
          {onNavigateModule && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateModule('pipeline', selectedOrgan !== 'all' ? selectedOrgan : 'bone')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to Metastasis Pipeline
              </button>
            </div>
          )}
        </div>

        {/* Framework Switcher Navigation Ribbon */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-800">
          {[
            {
              id: 'microdynamics',
              label: 'CTC Microvascular Transport',
              sublabel: 'Poiseuille • Margination • Arrest',
              icon: Droplets,
              badgeColor: 'border-rose-500/30 text-rose-300 bg-rose-500/10'
            },
            {
              id: 'organ_beds',
              label: 'Organ Vascular Beds',
              sublabel: 'Steric Sieve • Fenestrations • Pores',
              icon: Filter,
              badgeColor: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10'
            },
            {
              id: 'extravasation',
              label: 'Extravasation & Diapedesis',
              sublabel: 'Bell Catch-Bonds • VE-Cadherin • MMP',
              icon: Zap,
              badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-500/10'
            },
            {
              id: 'bifurcation',
              label: 'Bifurcation & Skimming',
              sublabel: "Murray's Law • Zweifach-Fung • Apex",
              icon: GitBranch,
              badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-500/10'
            },
            {
              id: '0d_windkessel',
              label: '0D Lumped-Parameter (0D)',
              sublabel: 'Windkessel 2/3/4 • PV Loops',
              icon: Radio,
              badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-500/10'
            },
            {
              id: '1d_wave',
              label: '1D Wave Propagation (1D)',
              sublabel: 'Moens-Korteweg • Pulse Reflections',
              icon: Network,
              badgeColor: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10'
            },
            {
              id: '3d_cfd',
              label: '3D Multiphysics CFD / FSI (3D)',
              sublabel: 'Navier-Stokes • WSS • FFR-CT',
              icon: Layers,
              badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-500/10'
            },
            {
              id: 'benchtop_mcl',
              label: 'Benchtop Mock Loop (MCL)',
              sublabel: 'In Vitro Actuators • LVADs • Valves',
              icon: Cpu,
              badgeColor: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
            }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition-all text-left ${
                  isCurrent
                    ? 'bg-slate-800 border-rose-500 shadow-md shadow-rose-950/30 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-900 text-slate-500'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <span>{tab.label}</span>
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 block">{tab.sublabel}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Framework Stage View */}
      {activeTab === 'microdynamics' && (
        <CirculatoryMicrodynamicsStage
          selectedOrgan={selectedOrgan}
          selectedCancerType={selectedCancerType}
        />
      )}

      {activeTab === 'organ_beds' && <OrganVascularBedFiltration />}

      {activeTab === 'extravasation' && <ExtravasationAdhesionKinetics />}

      {activeTab === 'bifurcation' && <BifurcationHemodynamicsSimulator />}

      {activeTab === '0d_windkessel' && <Windkessel0DViewer />}

      {activeTab === '1d_wave' && <WavePropagation1DViewer />}

      {activeTab === '3d_cfd' && <MultiphysicsCFD3DViewer />}

      {activeTab === 'benchtop_mcl' && <BenchtopMockLoopViewer />}

      {/* Software Engines & Clinical Reference Guide Footnote */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
        <h4 className="font-bold text-xs text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-rose-400" /> Notable Circulatory Simulators & Open Toolkits
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white font-mono block">SimVascular</strong>
            <p className="text-[11px] text-slate-400">Open-source 3D CFD & FSI pipeline for patient-specific vascular modeling, bypass grafts, and FFR calculation.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white font-mono block">CVSim</strong>
            <p className="text-[11px] text-slate-400">Open-source 0D lumped-parameter model for quantitative hemodynamic teaching & research (MIT/Harvard).</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white font-mono block">CARDIOSIM</strong>
            <p className="text-[11px] text-slate-400">Modular 0D/1D numerical platform for mechanical circulatory support evaluation (LVADs/ECMO) and heart failure dynamics.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white font-mono block">OpenFOAM / Fluent</strong>
            <p className="text-[11px] text-slate-400">Finite volume CFD solvers for heart valve hemodynamics, non-Newtonian blood rheology, and stent shear stress analysis.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white font-mono block">HEMOSIM / Harvi</strong>
            <p className="text-[11px] text-slate-400">Interactive web simulators for real-time Pressure-Volume (PV) loops, preload/afterload visualization, and clinical training.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
