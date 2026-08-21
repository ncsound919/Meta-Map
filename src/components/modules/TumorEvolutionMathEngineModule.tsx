import React, { useState, useEffect, useMemo } from 'react';
import { Slider } from '../ui/Slider';

import {
  GitBranch,
  Dna,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Sliders,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  Download,
  Info,
  Shield,
  Activity,
  CheckCircle2,
  Scale,
  Percent,
  Terminal,
  Cpu,
  Target,
  FlaskConical,
  BarChart3
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { OrganSite, PrimaryCancerType } from '../../types/metastasis';

interface TumorEvolutionMathEngineProps {
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
  onNavigateModule?: (moduleId: string, organ?: string) => void;
}

interface Subclone {
  id: string;
  name: string;
  color: string;
  parent: string | null;
  drivers: string[];
  fitnessS: number; // Selection advantage s
  drugSensitivity: number; // 0 (resistant) to 1 (highly sensitive)
  frequency: number; // 0 to 1
  initialCount: number;
}

export const TumorEvolutionMathEngineModule: React.FC<TumorEvolutionMathEngineProps> = ({
  selectedOrgan,
  selectedCancerType,
  onNavigateModule
}) => {
  // Math Engine Mode
  const [evolutionModel, setEvolutionModel] = useState<'gillespie_branching' | 'moran_fixation' | 'evolutionary_game_theory' | 'adaptive_containment'>('evolutionary_game_theory');
  
  // Mathematical Parameters
  const [somaticMutationRate, setSomaticMutationRate] = useState<number>(0.00025); // mutations per cell division
  const [carryingCapacityK, setCarryingCapacityK] = useState<number>(100000); // K cells
  const [selectionCoefficientS, setSelectionCoefficientS] = useState<number>(0.15); // s = 0.15 (15% fitness boost)
  const [drugRegimen, setDrugRegimen] = useState<'continuous_mtd' | 'adaptive_pulsed' | 'no_treatment'>('adaptive_pulsed');
  const [drugEfficacyKillPct, setDrugEfficacyKillPct] = useState<number>(85); // % kill rate of sensitive clones
  const [adaptiveLowerThresholdPct, setAdaptiveLowerThresholdPct] = useState<number>(50); // Stop drug when tumor shrinks to 50%
  const [timeHorizonMonths, setTimeHorizonMonths] = useState<number>(36);

  // EGT Payoff Matrix Configuration (Replicator Dynamics: GLY, ACID, VAS, RES)
  const [egtPayoffs, setEgtPayoffs] = useState<{
    gly_vs_gly: number;
    gly_vs_acid: number;
    gly_vs_vas: number;
    gly_vs_res: number;
    res_cost: number;
  }>({
    gly_vs_gly: 1.0,
    gly_vs_acid: 0.7,
    gly_vs_vas: 1.4,
    gly_vs_res: 0.9,
    res_cost: 0.25 // Metabolic penalty of drug efflux pumps
  });

  // Moran Process Live 2D Grid Simulator State
  const [moranGrid, setMoranGrid] = useState<string[]>(() => {
    const grid = Array(144).fill('WT');
    grid[66] = 'MUT'; // Center mutant
    return grid;
  });
  const [moranStep, setMoranStep] = useState<number>(0);
  const [moranIsPlaying, setMoranIsPlaying] = useState<boolean>(false);
  const [moranHistory, setMoranHistory] = useState<Array<{ step: number; muts: number; wts: number }>>([
    { step: 0, muts: 1, wts: 143 }
  ]);

  const handleMoranStep = React.useCallback(() => {
    setMoranGrid((prevGrid) => {
      const nextGrid = [...prevGrid];
      const n = nextGrid.length;
      const wildTypeCount = nextGrid.filter(x => x === 'WT').length;
      const mutantCount = n - wildTypeCount;

      if (wildTypeCount === 0 || mutantCount === 0) {
        setMoranIsPlaying(false);
        return prevGrid; // Absorption state reached
      }

      // Mutant fitness = 1.0 + s, Wild-type = 1.0
      const wMut = mutantCount * (1.0 + selectionCoefficientS);
      const wWt = wildTypeCount * 1.0;
      const totalW = wMut + wWt;

      const pDivideMutant = wMut / totalW;
      const dividingType = Math.random() < pDivideMutant ? 'MUT' : 'WT';

      // Uniformly choose a cell to replace (death event)
      const deadIndex = Math.floor(Math.random() * n);
      nextGrid[deadIndex] = dividingType;

      const finalMuts = nextGrid.filter(x => x === 'MUT').length;
      const finalWts = n - finalMuts;

      setMoranStep(prev => prev + 1);
      setMoranHistory(prev => [
        ...prev,
        { step: prev.length, muts: finalMuts, wts: finalWts }
      ].slice(-50));

      return nextGrid;
    });
  }, [selectionCoefficientS]);

  const resetMoran = () => {
    setMoranIsPlaying(false);
    const grid = Array(144).fill('WT');
    grid[66] = 'MUT';
    setMoranGrid(grid);
    setMoranStep(0);
    setMoranHistory([{ step: 0, muts: 1, wts: 143 }]);
  };

  useEffect(() => {
    let timer: any;
    if (moranIsPlaying) {
      timer = setInterval(() => {
        handleMoranStep();
      }, 100);
    }
    return () => clearInterval(timer);
  }, [moranIsPlaying, handleMoranStep]);

  // Clonal Lineage Tree State
  const initialClones: Subclone[] = useMemo(() => [
    {
      id: 'clone_founder',
      name: 'Clone 1 (Founder / Diploid)',
      color: '#38bdf8',
      parent: null,
      drivers: ['TP53 R248W', 'CDH1 loss'],
      fitnessS: 0.0,
      drugSensitivity: 0.95,
      frequency: 0.65,
      initialCount: 65000
    },
    {
      id: 'clone_angiogenic',
      name: 'Clone 2 (Pro-Angiogenic)',
      color: '#34d399',
      parent: 'clone_founder',
      drivers: ['VEGFA amp', 'HIF1A stab'],
      fitnessS: 0.12,
      drugSensitivity: 0.80,
      frequency: 0.25,
      initialCount: 25000
    },
    {
      id: 'clone_invasive_emt',
      name: 'Clone 3 (Hybrid EMT / Motile)',
      color: '#f59e0b',
      parent: 'clone_angiogenic',
      drivers: ['SNAI1 act', 'MMP9 high', 'ZEB1'],
      fitnessS: 0.22,
      drugSensitivity: 0.60,
      frequency: 0.08,
      initialCount: 8000
    },
    {
      id: 'clone_resistant_efflux',
      name: 'Clone 4 (Drug-Resistant MDR1+)',
      color: '#ec4899',
      parent: 'clone_invasive_emt',
      drivers: ['ABCB1 amp', 'PIK3CA E545K', 'ESR1 Y537S'],
      fitnessS: 0.05, // Lower basal fitness due to pump metabolic cost
      drugSensitivity: 0.05, // Highly resistant
      frequency: 0.02,
      initialCount: 2000
    }
  ], []);

  // Compute Time Series Evolution Trajectories
  const evolutionTrajectory = useMemo(() => {
    const points: Array<{
      month: number;
      totalTumorBurden: number;
      founderFreq: number;
      angiogenicFreq: number;
      invasiveEmtFreq: number;
      resistantFreq: number;
      drugDoseApplied: number;
    }> = [];

    // Model 1: Evolutionary Game Theory (EGT Replicator Dynamics)
    if (evolutionModel === 'evolutionary_game_theory') {
      let x = [0.45, 0.30, 0.20, 0.05]; // Initial shares of GLY, ACID, VAS, RES
      for (let m = 0; m <= timeHorizonMonths; m++) {
        const isDrugOn = drugRegimen !== 'no_treatment';
        
        // Define payoff-dependent fitness for each of the four phenotypes
        // GLY benefits from self-interaction and cooperation, but suffers under drug if sensitive
        const f_gly = x[0] * egtPayoffs.gly_vs_gly + x[1] * egtPayoffs.gly_vs_acid + x[2] * egtPayoffs.gly_vs_vas + x[3] * 0.5;
        const f_acid = x[0] * 1.1 + x[1] * 0.8 + x[2] * 0.9 + x[3] * 0.6;
        const f_vas = x[0] * 1.3 + x[1] * 1.0 + x[2] * 1.2 + x[3] * 0.7;
        const f_res = (x[0] * egtPayoffs.gly_vs_res + x[1] * 0.9 + x[2] * 1.1 + x[3] * 1.0) - (isDrugOn ? 0.0 : egtPayoffs.res_cost);

        const kill = isDrugOn ? (drugEfficacyKillPct / 100) * 0.55 : 0;
        const fit = [
          Math.max(0.05, f_gly - kill * 0.9),
          Math.max(0.05, f_acid - kill * 0.7),
          Math.max(0.05, f_vas - kill * 0.5),
          Math.max(0.05, f_res) // Resistant clone has efflux
        ];

        const avg_fit = x[0] * fit[0] + x[1] * fit[1] + x[2] * fit[2] + x[3] * fit[3];

        // Replicator dynamic step
        let next_x = x.map((xi, idx) => Math.max(0.005, xi + xi * (fit[idx] - avg_fit) * 0.25));
        const sum_x = next_x.reduce((a, b) => a + b, 0);
        x = next_x.map(v => v / sum_x);

        points.push({
          month: m,
          totalTumorBurden: Math.round(90000 * (1.0 + 0.02 * m)),
          founderFreq: Math.round(x[0] * 100),
          angiogenicFreq: Math.round(x[1] * 100),
          invasiveEmtFreq: Math.round(x[2] * 100),
          resistantFreq: Math.round(x[3] * 100),
          drugDoseApplied: isDrugOn ? 100 : 0
        });
      }
      return points;
    }

    // Model 2: Gillespie SSA (Continuous-Time Stochastic Branching with Random Noise)
    if (evolutionModel === 'gillespie_branching') {
      let c1 = 65000;
      let c2 = 25000;
      let c3 = 8000;
      let c4 = 2000;
      let isDrugOn = drugRegimen !== 'no_treatment';

      for (let m = 0; m <= timeHorizonMonths; m++) {
        const total = c1 + c2 + c3 + c4;
        points.push({
          month: m,
          totalTumorBurden: Math.round(total),
          founderFreq: Math.round((c1 / Math.max(1, total)) * 100),
          angiogenicFreq: Math.round((c2 / Math.max(1, total)) * 100),
          invasiveEmtFreq: Math.round((c3 / Math.max(1, total)) * 100),
          resistantFreq: Math.round((c4 / Math.max(1, total)) * 100),
          drugDoseApplied: isDrugOn ? 100 : 0
        });

        // Stochastic brownian perturbation added to the birth/death steps
        const sNoise = () => (Math.random() - 0.5) * 0.15 * Math.sqrt(m + 1);

        const logisticFactor = Math.max(0.01, 1 - total / carryingCapacityK);
        const drugKillFactor = isDrugOn ? (drugEfficacyKillPct / 100) : 0;

        const g1 = (0.10 * logisticFactor) - (drugKillFactor * 0.95) + sNoise();
        const g2 = (0.12 * (1 + selectionCoefficientS) * logisticFactor) - (drugKillFactor * 0.80) + sNoise();
        const g3 = (0.14 * (1 + selectionCoefficientS * 1.5) * logisticFactor) - (drugKillFactor * 0.60) + sNoise();
        const g4 = (0.08 * (1 - egtPayoffs.res_cost) * logisticFactor) - (drugKillFactor * 0.05) + sNoise();

        c1 = Math.max(10, c1 + c1 * g1);
        c2 = Math.max(10, c2 + c2 * g2);
        c3 = Math.max(10, c3 + c3 * g3);
        c4 = Math.max(10, c4 + c4 * g4 + (c1 + c2) * somaticMutationRate * 5);
      }
      return points;
    }

    // Model 3: Moran Model Fixation (Visualizing fixation probabilities)
    if (evolutionModel === 'moran_fixation') {
      const relativeFitnessR = 1 + selectionCoefficientS;
      for (let m = 0; m <= timeHorizonMonths; m++) {
        // Fixation probability curve over time step N
        const progress = m / timeHorizonMonths;
        const fixationPct = (1.0 - Math.exp(-relativeFitnessR * progress * 3)) * 100;
        const wildTypePct = Math.max(0, 100 - fixationPct);
        
        points.push({
          month: m,
          totalTumorBurden: 144, // Small Moran grid size
          founderFreq: Math.round(wildTypePct * 0.8),
          angiogenicFreq: Math.round(wildTypePct * 0.2),
          invasiveEmtFreq: 0,
          resistantFreq: Math.round(fixationPct),
          drugDoseApplied: 0
        });
      }
      return points;
    }

    // Model 4: Adaptive Containment
    let c1 = 65000;
    let c2 = 25000;
    let c3 = 8000;
    let c4 = 2000;
    let isDrugOn = drugRegimen !== 'no_treatment';

    for (let m = 0; m <= timeHorizonMonths; m++) {
      const total = c1 + c2 + c3 + c4;
      const initialTotal = 100000;

      // Adaptive therapy decision logic
      if (drugRegimen === 'adaptive_pulsed') {
        if (total < initialTotal * (adaptiveLowerThresholdPct / 100)) {
          isDrugOn = false; // Pause therapy
        } else if (total >= initialTotal * 0.9) {
          isDrugOn = true; // Resume therapy
        }
      } else if (drugRegimen === 'continuous_mtd') {
        isDrugOn = true;
      } else {
        isDrugOn = false;
      }

      points.push({
        month: m,
        totalTumorBurden: Math.round(total),
        founderFreq: Math.round((c1 / Math.max(1, total)) * 100),
        angiogenicFreq: Math.round((c2 / Math.max(1, total)) * 100),
        invasiveEmtFreq: Math.round((c3 / Math.max(1, total)) * 100),
        resistantFreq: Math.round((c4 / Math.max(1, total)) * 100),
        drugDoseApplied: isDrugOn ? 100 : 0
      });

      const logisticFactor = Math.max(0.01, 1 - total / carryingCapacityK);
      const drugKillFactor = isDrugOn ? (drugEfficacyKillPct / 100) : 0;

      const g1 = (0.10 * logisticFactor) - (drugKillFactor * 0.95);
      const g2 = (0.12 * (1 + selectionCoefficientS) * logisticFactor) - (drugKillFactor * 0.80);
      const g3 = (0.14 * (1 + selectionCoefficientS * 1.5) * logisticFactor) - (drugKillFactor * 0.60);
      const g4 = (0.08 * (1 - egtPayoffs.res_cost) * logisticFactor) - (drugKillFactor * 0.05);

      const mutationInflux = (c1 + c2 + c3) * somaticMutationRate * 10;

      c1 = Math.max(10, c1 + c1 * g1);
      c2 = Math.max(10, c2 + c2 * g2);
      c3 = Math.max(10, c3 + c3 * g3);
      c4 = Math.max(10, c4 + c4 * g4 + mutationInflux);
    }

    return points;
  }, [
    evolutionModel,
    timeHorizonMonths,
    carryingCapacityK,
    selectionCoefficientS,
    drugRegimen,
    drugEfficacyKillPct,
    adaptiveLowerThresholdPct,
    egtPayoffs.res_cost,
    egtPayoffs.gly_vs_gly,
    egtPayoffs.gly_vs_acid,
    egtPayoffs.gly_vs_vas,
    egtPayoffs.gly_vs_res,
    somaticMutationRate
  ]);

  // Moran Process Fixation Probability Calculation
  // P_fix = (1 - 1/r) / (1 - 1/r^N)
  const relativeFitnessR = 1 + selectionCoefficientS;
  const moranN = 500; // Micro-niche population
  const analyticFixationProb = (
    ((1 - 1 / relativeFitnessR) / (1 - Math.pow(1 / relativeFitnessR, moranN))) * 100
  ).toFixed(2);

  const neutralFixationProb = ((1 / moranN) * 100).toFixed(3);

  // Time to competitive escape under MTD vs Adaptive
  const currentResistantFraction = evolutionTrajectory[evolutionTrajectory.length - 1]?.resistantFreq || 0;
  const currentTotalBurden = evolutionTrajectory[evolutionTrajectory.length - 1]?.totalTumorBurden || 0;

  return (
    <div className="space-y-6" id="tumor-evolution-math-engine-module">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-10 w-60 h-60 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <GitBranch className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
                Stochastic Clonal Dynamics & Evolutionary Game Theory Engine
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Tumor Evolution & Clonal Competition Math Engine
            </h2>
            <p className="text-slate-400 text-sm max-w-3xl mt-1">
              Simulates branching stochastic processes, Moran/Wright-Fisher fixation probabilities,
              EGT Replicator ODEs, and evolutionary adaptive therapy to prevent competitive release of drug-resistant subclones.
            </p>
          </div>

          {/* Model Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'evolutionary_game_theory', label: 'EGT Replicator Dynamics' },
              { id: 'adaptive_containment', label: 'Adaptive Therapy' },
              { id: 'moran_fixation', label: 'Moran Model (Pfix)' },
              { id: 'gillespie_branching', label: 'Gillespie SSA' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setEvolutionModel(m.id as any)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs border transition-all ${
                  evolutionModel === m.id
                    ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-md shadow-indigo-950/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Top Analytics Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block">SELECTION ADVANTAGE (s)</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">+{(selectionCoefficientS * 100).toFixed(1)}%</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block">MORAN FIXATION PROB (Pfix)</span>
            <span className="text-lg font-bold text-indigo-400 font-mono">{analyticFixationProb}%</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block">NEUTRAL DRIFT (1/N)</span>
            <span className="text-lg font-bold text-slate-400 font-mono">{neutralFixationProb}%</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block">FINAL RESISTANT CLONE %</span>
            <span className={`text-lg font-bold font-mono ${currentResistantFraction > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {currentResistantFraction}%
            </span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block">TUMOR BURDEN (T={timeHorizonMonths}m)</span>
            <span className="text-lg font-bold text-amber-400 font-mono">{currentTotalBurden.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block">REGIMEN CONTROL</span>
            <span className="text-lg font-bold text-cyan-400 font-mono uppercase">{drugRegimen === 'adaptive_pulsed' ? 'Adaptive' : drugRegimen === 'continuous_mtd' ? 'MTD Kill' : 'Off'}</span>
          </div>
        </div>
      </div>

      {/* Main Fishplot & Clonal Streamgraph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Clonal Dynamics Fishplot / Area Chart */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">
                  Clonal Subpopulation Evolution (Mueller Fishplot / Streamgraph)
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-sky-400">
                  <span className="w-2.5 h-2.5 rounded bg-sky-400 inline-block" /> Founder
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block" /> Angiogenic
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" /> Motile/EMT
                </span>
                <span className="flex items-center gap-1 text-pink-400">
                  <span className="w-2.5 h-2.5 rounded bg-pink-500 inline-block" /> Resistant (MDR1+)
                </span>
              </div>
            </div>

            {/* Area Chart Fishplot */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolutionTrajectory} stackOffset="expand">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Time (Months)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(val) => `${Math.round(val * 100)}%`} label={{ value: 'Subclone Frequency', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${val}%`, 'Clonal Share']}
                  />
                  <Area type="monotone" dataKey="founderFreq" name="Clone 1 (Founder)" stackId="1" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.85} />
                  <Area type="monotone" dataKey="angiogenicFreq" name="Clone 2 (Angiogenic)" stackId="1" stroke="#34d399" fill="#34d399" fillOpacity={0.85} />
                  <Area type="monotone" dataKey="invasiveEmtFreq" name="Clone 3 (Motile/EMT)" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.85} />
                  <Area type="monotone" dataKey="resistantFreq" name="Clone 4 (Drug-Resistant)" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.85} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Treatment Regimen Overlay Legend */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">
                COMPETITIVE RELEASE PHENOMENON:
              </span>
              <span className="text-slate-300 font-mono">
                {drugRegimen === 'continuous_mtd'
                  ? '⚠️ High-dose MTD eliminates sensitive competitors, triggering rapid exponential expansion of Clone 4.'
                  : drugRegimen === 'adaptive_pulsed'
                  ? '✅ Adaptive dosing maintains sensitive competitors to suppress resistant Clone 4 outgrowth via space/nutrient competition.'
                  : 'Untreated baseline: Clonal selection dominated by intrinsic fitness s.'}
              </span>
            </div>
          </div>

          {/* MODEL-SPECIFIC INTERACTIVE MATHEMATICAL WORKSPACES */}
          {evolutionModel === 'evolutionary_game_theory' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-sm text-white">Interactive Replicator Payoff Matrix</h3>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase">EGT Dynamic Landscape</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Replicator dynamics models clonal competition as a game where payoff interactions dictate fitness. 
                Tweak the cooperation, competition, and resistance cost parameters below to watch subclone trajectories shift.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/60">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 font-mono">Matrix Payoff Co-efficients:</h4>
                  
                  <Slider
                    label="Glycolytic Self-Benefit (GLY vs GLY):"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={egtPayoffs.gly_vs_gly}
                    onChange={(val) => setEgtPayoffs(p => ({ ...p, gly_vs_gly: val }))}
                    valueDisplay={<>{egtPayoffs.gly_vs_gly.toFixed(1)}</>}
                  />

                  <Slider
                    label="Niche Cooperation (GLY vs ACID):"
                    min={0.2}
                    max={1.5}
                    step={0.1}
                    value={egtPayoffs.gly_vs_acid}
                    onChange={(val) => setEgtPayoffs(p => ({ ...p, gly_vs_acid: val }))}
                    valueDisplay={<>{egtPayoffs.gly_vs_acid.toFixed(1)}</>}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 font-mono">Vasculature & Resistance Cost:</h4>

                  <Slider
                    label="Angiogenic Growth Benefit (GLY vs VAS):"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={egtPayoffs.gly_vs_vas}
                    onChange={(val) => setEgtPayoffs(p => ({ ...p, gly_vs_vas: val }))}
                    valueDisplay={<>{egtPayoffs.gly_vs_vas.toFixed(1)}</>}
                  />

                  <Slider
                    label="Resistant Pump Metabolic Cost:"
                    min={0.05}
                    max={0.50}
                    step={0.05}
                    value={egtPayoffs.res_cost}
                    onChange={(val) => setEgtPayoffs(p => ({ ...p, res_cost: val }))}
                    valueDisplay={<>-{(egtPayoffs.res_cost * 100).toFixed(0)}% fitness</>}
                  />
                </div>
              </div>

              <div className="p-3.5 bg-indigo-950/20 rounded-xl border border-indigo-900/40 text-xs flex gap-3 text-indigo-300">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold block mb-1">Mathematical Replicator Differential ODE:</span>
                  <code className="text-[11px] block font-mono bg-indigo-950/40 p-1.5 rounded text-indigo-200 mt-1">
                    dx_i/dt = x_i * ( f_i(x) - ∑ x_j * f_j(x) )
                  </code>
                </div>
              </div>
            </div>
          )}

          {evolutionModel === 'moran_fixation' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">Live 2D Stochastic Moran Process Simulator</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase">12x12 Micro-Niche Lattice</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                A Moran Process tracks stochastic birth-death in a finite population. Below is a 144-cell tumor micro-niche. 
                Wild-type cells are <span className="text-sky-400 font-bold">Blue</span> (fitness = 1.0). Mutants are <span className="text-pink-500 font-bold">Pink</span> (fitness = 1 + s). 
                Click "Run Step" or "Auto-Play" to simulate real-time cell replacement!
              </p>

              <div className="flex flex-col md:flex-row gap-5 items-center">
                {/* 12x12 Lattice Grid */}
                <div className="grid grid-cols-12 gap-1 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  {moranGrid.map((cell, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const next = [...moranGrid];
                        next[idx] = next[idx] === 'WT' ? 'MUT' : 'WT';
                        setMoranGrid(next);
                      }}
                      className={`w-5 h-5 rounded-sm transition-all duration-100 ${
                        cell === 'WT'
                          ? 'bg-sky-500/30 border border-sky-500/50 hover:bg-sky-500/60'
                          : 'bg-pink-500 border border-pink-400 shadow-md shadow-pink-900/50 animate-pulse'
                      }`}
                      title={cell === 'WT' ? 'Wild-Type (Diploid)' : 'Mutant (Resistant Clone)'}
                    />
                  ))}
                </div>

                {/* Moran Simulator Controls */}
                <div className="flex-1 w-full space-y-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>Total Steps:</span>
                      <strong className="text-white">{moranStep}</strong>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>Mutant Cells:</span>
                      <strong className="text-pink-400">{moranGrid.filter(x => x === 'MUT').length} / 144</strong>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>Selection s:</span>
                      <strong className="text-emerald-400">+{selectionCoefficientS * 100}%</strong>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleMoranStep}
                      className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-400" /> Run Step
                    </button>
                    <button
                      onClick={() => setMoranIsPlaying(!moranIsPlaying)}
                      className={`flex-1 py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        moranIsPlaying
                          ? 'bg-rose-900/60 text-rose-200 border border-rose-700 hover:bg-rose-800/80'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500'
                      }`}
                    >
                      {moranIsPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" /> Auto-Play
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetMoran}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                      title="Reset Lattice"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stochastic Moran Walk Line Chart */}
              {moranStep > 0 && (
                <div className="h-28 w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moranHistory}>
                      <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                      <XAxis dataKey="step" hide />
                      <YAxis domain={[0, 144]} tick={{ fontSize: 9 }} stroke="#64748b" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} labelStyle={{ color: '#94a3b8' }} />
                      <Line type="monotone" dataKey="muts" stroke="#ec4899" strokeWidth={2} dot={false} name="Mutant Count" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {evolutionModel === 'gillespie_branching' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-white">Gillespie SSA Transition Rates & Noise</h3>
                </div>
                <span className="text-[10px] font-mono text-amber-500 uppercase">Stochastic Jump Process</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The Gillespie Stochastic Simulation Algorithm (SSA) simulates individual reactions in a master equation. 
                Instead of smooth differential integration, it samples the exact time and type of the next cell division/death. 
                This introduces physical stochastic noise (drift), creating realistic, jagged subclone histories.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Reaction Propensities (a_j)</span>
                  <div className="space-y-1.5 mt-2 font-mono text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Division:</span>
                      <span className="text-emerald-400">c_birth * X_i * (1 - N/K)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Therapeutic Death:</span>
                      <span className="text-rose-400">c_drug * X_i</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Seed Stochasticity</span>
                    <p className="text-[10px] text-slate-400 mt-1">Re-calculate stochastic walk using fresh random paths.</p>
                  </div>
                  <button
                    onClick={() => {
                      // Simple state trigger to cause recalculation
                      setSomaticMutationRate(prev => prev + 0.00000001);
                    }}
                    className="mt-2 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-mono text-[10px] rounded border border-slate-700 transition-all flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Re-Simulate Gillespie Walk
                  </button>
                </div>
              </div>
            </div>
          )}

          {evolutionModel === 'adaptive_containment' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-sm text-white">Competitive Release & Containment Diagnostics</h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">Evolutionary Therapy</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold font-mono text-rose-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-ping" /> Maximum Tolerated Dose (MTD)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Eliminating all sensitive competitors removes nutrient and space constraints, triggering rapid <strong>competitive release</strong> of highly resistant Clone 4.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Adaptive Therapy (Containment)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Maintains a stable subpopulation of sensitive competitors via scheduled pauses. This keeps resistant cells dormant under dense spatial competition.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Clonal Lineage Phylogenetic Tree Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Dna className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Phylogenetic Subclone Tree & Driver Accretion</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Continuous-Time Markov Branching</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {initialClones.map((clone) => (
                <div
                  key={clone.id}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 relative"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: clone.color }} />
                    <span className="font-bold font-mono text-xs text-white truncate">{clone.name}</span>
                  </div>

                  <div className="space-y-1 text-[10px] font-mono mt-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Selection s:</span>
                      <strong className="text-emerald-400">+{clone.fitnessS * 100}%</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Drug Sens:</span>
                      <strong className="text-cyan-400">{clone.drugSensitivity * 100}%</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase mb-1">Acquired Drivers:</span>
                    <div className="flex flex-wrap gap-1">
                      {clone.drivers.map((drv) => (
                        <span key={drv} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[9px] border border-slate-800">
                          {drv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Evolution Math Controls */}
        <div className="lg:col-span-4 space-y-4">
          {/* Treatment Regimen Selector */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Therapeutic Regimen Strategy</h3>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'adaptive_pulsed',
                  label: 'Adaptive Therapy (Containment)',
                  desc: 'Pulsed dosing to preserve sensitive competitors and suppress resistant emergence.'
                },
                {
                  id: 'continuous_mtd',
                  label: 'Maximum Tolerated Dose (MTD)',
                  desc: 'Continuous high-dose kill; risks rapid competitive release of resistant mutants.'
                },
                {
                  id: 'no_treatment',
                  label: 'No Therapeutic Selection',
                  desc: 'Natural clonal drift governed strictly by intrinsic fitness parameters.'
                }
              ].map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setDrugRegimen(reg.id as any)}
                  className={`w-full p-3 rounded-xl text-left border text-xs transition-all ${
                    drugRegimen === reg.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold font-mono text-xs flex justify-between items-center">
                    <span>{reg.label}</span>
                    {drugRegimen === reg.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{reg.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Mathematical Parameters Sliders */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">Evolutionary Math Variables</h3>
            </div>

            {/* Somatic Mutation Rate */}
            <Slider
              label="Mutation Rate (μ per division):"
              min={0.00001}
              max={0.00100}
              step={0.00005}
              value={somaticMutationRate}
              onChange={setSomaticMutationRate}
              valueDisplay={<>{somaticMutationRate.toFixed(5)}</>}
            />

            {/* Selection Coefficient */}
            <Slider
  label="Selection Advantage (s):"
  min={0.01}
  max={0.50}
  step={0.02}
  value={selectionCoefficientS}
  onChange={setSelectionCoefficientS}
  valueDisplay={<>+{(selectionCoefficientS * 100).toFixed(1)}%</>}
/>

            {/* Drug Kill Rate */}
            <Slider
  label="Drug Kill Efficacy (Sensitive):"
  min={30}
  max={99}
  step={5}
  value={drugEfficacyKillPct}
  onChange={setDrugEfficacyKillPct}
  valueDisplay={<>{drugEfficacyKillPct}%</>}
/>

            {/* Adaptive Pause Threshold */}
            {drugRegimen === 'adaptive_pulsed' && (
              <Slider
  label="Adaptive Pause Threshold:"
  min={20}
  max={80}
  step={5}
  value={adaptiveLowerThresholdPct}
  onChange={setAdaptiveLowerThresholdPct}
  valueDisplay={<>{adaptiveLowerThresholdPct}% initial size</>}
/>
            )}

            {/* Time Horizon */}
            <Slider
  label="Time Horizon (Months):"
  min={12}
  max={60}
  step={6}
  value={timeHorizonMonths}
  onChange={setTimeHorizonMonths}
  valueDisplay={<>{timeHorizonMonths} mo</>}
/>
          </div>
        </div>
      </div>
    </div>
  );
};
