import React, { useState, useEffect } from 'react';
import { OrganSite, PrimaryCancerType } from '../../types/metastasis';
import {
  Flame,
  Zap,
  Sliders,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Dna,
  Share2,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  Swords,
  Target,
  Repeat,
  Compass
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ResistanceForgeModuleProps {
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
}

export const ResistanceForgeModule: React.FC<ResistanceForgeModuleProps> = ({
  selectedOrgan,
  selectedCancerType
}) => {
  // Arena State
  const [selectivePressure, setSelectivePressure] = useState<string>('TARGETED_TKIS_CDK4_6');
  const [accelerationFactor, setAccelerationFactor] = useState<number>(50);
  const [isForging, setIsForging] = useState<boolean>(false);
  const [forgeResults, setForgeResults] = useState<any>(null);

  useEffect(() => {
    runEvolutionaryArena();
  }, [selectivePressure, accelerationFactor, selectedOrgan, selectedCancerType]);

  const runEvolutionaryArena = async () => {
    setIsForging(true);
    try {
      const res = await fetch('/api/resistance-forge/forge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectivePressure,
          organSite: selectedOrgan,
          cancerType: selectedCancerType,
          accelerationFactor
        })
      });
      if (res.ok) {
        const data = await res.json();
        setForgeResults(data);
      }
    } catch (e) {
      console.error('Failed to run evolutionary resistance forge:', e);
    } finally {
      setIsForging(false);
    }
  };

  // Export Evolutionary Trajectory
  const handleExportEvolutionCsv = () => {
    if (!forgeResults) return;
    const headers = ['Generation', 'Simulated_Days', 'Sensitive_Population', 'Resistant_Subclone', 'Niche_Remodeled_Stroma', 'Fitness_Index'];
    const rows = forgeResults.evolutionaryTrajectory.map((t: any) => [
      t.generation,
      t.simulatedDays,
      t.sensitivePop,
      t.resistantPop,
      t.nicheRemodeledStroma,
      t.populationFitnessIndex
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Evolutionary_Resistance_Forge_${selectivePressure}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectivePressureOptions = [
    {
      id: 'TARGETED_TKIS_CDK4_6',
      name: 'Targeted TKIs & CDK4/6 Inhibitors',
      category: 'Targeted Therapies',
      description: 'Continuous Palbociclib + Letrozole pressure driving ligand-independent ESR1 mutations.'
    },
    {
      id: 'PD1_CHECKPOINT_IMMUNOTHERAPY',
      name: 'Anti-PD-1 Checkpoint Immunotherapy',
      category: 'Immune Selection',
      description: 'Sustained CD8+ T-cell cytolytic pressure forcing antigen presentation loss.'
    },
    {
      id: 'FLUID_SHEAR_METABOLIC_RESTRICTION',
      name: 'Fluid Shear & Glucose/Glutamine Deprivation',
      category: 'Physico-Metabolic Bottlenecks',
      description: 'High microvascular turbulence + nutrient starvation driving CD36/FAO metabolic switching.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5" />
                Adversarial Evolutionary Arena (The Cousin)
              </span>
              <span className="text-xs text-slate-400 font-mono">Staying One Step Ahead of Metastatic Adaptation</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Metastatic Resistance Forge
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              An adversarial living system that accelerates evolutionary timescales (10x to 100x) to observe years of therapeutic resistance in days — generating <strong>collateral sensitivity traps</strong> and <strong>sequential schedules</strong> to defeat metastatic adaptation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportEvolutionCsv}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" /> Export Resistance Trajectory (.CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Extended Family Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-400">
          <span className="text-slate-500 text-[9px] block font-sans font-bold">1. WHO & WHAT</span>
          <span className="text-cyan-300 font-bold font-sans text-xs">Living Atlas</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-400">
          <span className="text-slate-500 text-[9px] block font-sans font-bold">2. WHERE & HOW</span>
          <span className="text-cyan-300 font-bold font-sans text-xs">Cascade Simulator</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-400">
          <span className="text-slate-500 text-[9px] block font-sans font-bold">3. WHEN & NEXT</span>
          <span className="text-cyan-300 font-bold font-sans text-xs">Forecast Engine</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-400">
          <span className="text-slate-500 text-[9px] block font-sans font-bold">4. WHY</span>
          <span className="text-amber-300 font-bold font-sans text-xs">Causal Oracle</span>
        </div>
        <div className="bg-rose-950/60 p-2.5 rounded-lg border border-rose-500/40 text-rose-300 font-bold shadow-md">
          <span className="text-rose-400 text-[9px] block font-sans font-bold">5. THE COUSIN</span>
          <span className="text-white font-sans text-xs">Resistance Forge</span>
        </div>
      </div>

      {/* Main Arena Controls & Evolutionary Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Selective Pressure Arena Controls */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              Selective Pressure & Acceleration Setup
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Apply continuous therapeutic or niche selective bottlenecks.
            </p>
          </div>

          <div className="space-y-3">
            {selectivePressureOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectivePressure(opt.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs space-y-1 ${
                  selectivePressure === opt.id
                    ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{opt.name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-rose-300 font-mono text-[10px] border border-slate-800">
                    {opt.category}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {opt.description}
                </p>
              </button>
            ))}
          </div>

          {/* Acceleration Factor Slider */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-bold">Evolutionary Speed Acceleration:</label>
              <span className="font-mono text-rose-300 font-bold">{accelerationFactor}x Speed</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={accelerationFactor}
              onChange={(e) => setAccelerationFactor(Number(e.target.value))}
              className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              {accelerationFactor}x = 20 generations (2 years of patient evolution) simulated in ~{(280 / accelerationFactor).toFixed(1)} minutes.
            </p>
          </div>

          <button
            onClick={runEvolutionaryArena}
            disabled={isForging}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isForging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4 text-amber-300" />}
            Forge Evolutionary Resistance Loop
          </button>
        </div>

        {/* Right Column: Clonal Dynamics & Counter-Strategy Generator */}
        <div className="lg:col-span-7 space-y-6">
          {forgeResults && (
            <>
              {/* Evolutionary Clonal Dynamics Chart */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-rose-400" />
                      Clonal Shift over 20 Accelerated Generations
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tracking sub-clone competition, stroma remodeling, and population fitness.
                    </p>
                  </div>
                </div>

                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forgeResults.evolutionaryTrajectory}>
                      <defs>
                        <linearGradient id="colorSensitive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorResistant" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="generation" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Generations', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Area type="monotone" dataKey="sensitivePop" name="Sensitive Wild-Type Cells" stroke="#38bdf8" fillOpacity={1} fill="url(#colorSensitive)" strokeWidth={2} />
                      <Area type="monotone" dataKey="resistantPop" name="Emergent Resistant Sub-clone" stroke="#f43f5e" fillOpacity={1} fill="url(#colorResistant)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Emergent Mechanism & Collateral Sensitivity Trap */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    Emergent Driver & Collateral Sensitivity Vulnerability
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-rose-400 font-bold block">Emergent Resistance Mechanism:</span>
                    <p className="text-white leading-relaxed font-mono">
                      {forgeResults.emergentMechanism}
                    </p>
                  </div>

                  <div className="bg-emerald-950/40 p-3.5 rounded-lg border border-emerald-800/80 space-y-1">
                    <span className="text-emerald-300 font-bold block flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Induced Collateral Sensitivity Trap Target:
                    </span>
                    <p className="text-white font-bold leading-relaxed font-mono">
                      {forgeResults.collateralSensitivityTarget}
                    </p>
                  </div>
                </div>

                {/* Counter-Strategy Sequential Schedule */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-xs">Sequential Evolutionary Counter-Schedule:</span>
                    <span className="text-emerald-400 font-mono font-bold text-xs">
                      {forgeResults.counterStrategy.predictedSustainedControlPct}% Sustained Disease Control
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {forgeResults.counterStrategy.sequentialSchedule.map((step: any, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                        <span className="text-rose-300 font-bold">{step.phase}</span>
                        <span className="text-slate-200">{step.action}</span>
                        <span className="text-slate-400 text-[10px] bg-slate-950 px-2 py-0.5 rounded">{step.targetSubclone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Closed Feedback Loop to the Original Quartet */}
              <div className="bg-rose-950/30 border border-rose-800/60 rounded-xl p-4 text-xs space-y-2">
                <span className="font-bold text-rose-300 block flex items-center gap-1.5">
                  <Repeat className="w-4 h-4 text-rose-400" />
                  Closed-Loop Feedback Synchronization across Extended Family:
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px] font-mono list-disc list-inside">
                  <li><strong>Atlas:</strong> {forgeResults.closedFeedbackQuartet.atlasAction}</li>
                  <li><strong>Forecast Engine:</strong> {forgeResults.closedFeedbackQuartet.forecastEngineUpdate}</li>
                  <li><strong>Causal Oracle:</strong> {forgeResults.closedFeedbackQuartet.causalOracleInsight}</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
