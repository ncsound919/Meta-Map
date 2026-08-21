import React, { useState, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FlaskConical,
  Activity,
  Layers,
  ChevronRight,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export interface InterventionScenario {
  id: string;
  name: string;
  category: 'monotherapy' | 'dual' | 'triplet' | 'cellular' | 'innate';
  drugs: string[];
  description: string;
  mechanism: string;
  color: string;
  baseParams: {
    antiPd1Dose: number; // 0 - 100
    antiCtla4Dose: number; // 0 - 100
    csf1rInhibitor: number; // 0 - 100
    tgfbBlocker: number; // 0 - 100
    stingAgonist: number; // 0 - 100
    ido1Inhibitor: number; // 0 - 100
    carTTiter: number; // 0 - 100
  };
}

export const PRESET_SCENARIOS: InterventionScenario[] = [
  {
    id: 'control_chemo',
    name: 'Control Arm: Standard Cytotoxic Chemotherapy',
    category: 'monotherapy',
    drugs: ['Carboplatin + Paclitaxel'],
    description: 'Direct cytoreduction with minimal immune priming. Transient antigen surge followed by immune exhaustion.',
    mechanism: 'DNA crosslinking & mitotic arrest without long-term immune memory or checkpoint reversal.',
    color: '#94a3b8',
    baseParams: {
      antiPd1Dose: 0,
      antiCtla4Dose: 0,
      csf1rInhibitor: 0,
      tgfbBlocker: 0,
      stingAgonist: 10,
      ido1Inhibitor: 0,
      carTTiter: 0
    }
  },
  {
    id: 'anti_pd1_mono',
    name: 'Monotherapy: Anti-PD-1 (Pembrolizumab)',
    category: 'monotherapy',
    drugs: ['Pembrolizumab 200mg Q3W'],
    description: 'Restores exhausted CD8+ T cell effector function by blocking PD-1:PD-L1 inhibitory axis.',
    mechanism: 'Disrupts SHP-2 phosphatase recruitment; effective in PD-L1+ and MSI-H / high-TMB tumors.',
    color: '#38bdf8',
    baseParams: {
      antiPd1Dose: 85,
      antiCtla4Dose: 0,
      csf1rInhibitor: 0,
      tgfbBlocker: 0,
      stingAgonist: 0,
      ido1Inhibitor: 0,
      carTTiter: 0
    }
  },
  {
    id: 'dual_checkpoint',
    name: 'Dual Blockade: Anti-PD-1 + Anti-CTLA-4 (Nivo + Ipi)',
    category: 'dual',
    drugs: ['Nivolumab 3mg/kg + Ipilimumab 1mg/kg'],
    description: 'Synergistic priming in lymph nodes (CTLA-4) plus effector reinvigoration in tumor tissue (PD-1).',
    mechanism: 'Promotes de novo T cell repertoire expansion while dampening Treg suppressor capacity.',
    color: '#a855f7',
    baseParams: {
      antiPd1Dose: 85,
      antiCtla4Dose: 75,
      csf1rInhibitor: 0,
      tgfbBlocker: 0,
      stingAgonist: 0,
      ido1Inhibitor: 0,
      carTTiter: 0
    }
  },
  {
    id: 'triplet_reprogram',
    name: 'TME Matrix & Myeloid Breaker (Anti-PD-1 + CSF-1R-i + Anti-TGF-β)',
    category: 'triplet',
    drugs: ['Anti-PD-1 + PLX3397 (Pexidartinib) + Bintrafusp Alfa'],
    description: 'Dismantles dense CAF collagen barriers, repolarizes M2 TAMs into M1, and unleashes CD8+ infiltration.',
    mechanism: 'Converts "Immune Excluded" cold tumors into inflamed hot zones with dense intratumoral T cell penetration.',
    color: '#10b981',
    baseParams: {
      antiPd1Dose: 85,
      antiCtla4Dose: 0,
      csf1rInhibitor: 80,
      tgfbBlocker: 90,
      stingAgonist: 0,
      ido1Inhibitor: 40,
      carTTiter: 0
    }
  },
  {
    id: 'innate_prime_cd47',
    name: 'Innate Primer: STING Agonist + Anti-CD47 "Don\'t Eat Me"',
    category: 'innate',
    drugs: ['ADU-S100 (Intratumoral STING) + Magrolimab (Anti-CD47)'],
    description: 'Triggers massive type-I interferon release and unleashes macrophage phagocytosis against metastatic clones.',
    mechanism: 'Activates cDC1 BATF3+ cross-priming and eliminates tumor cloaking from innate phagocytes.',
    color: '#f59e0b',
    baseParams: {
      antiPd1Dose: 40,
      antiCtla4Dose: 0,
      csf1rInhibitor: 30,
      tgfbBlocker: 0,
      stingAgonist: 95,
      ido1Inhibitor: 0,
      carTTiter: 0
    }
  },
  {
    id: 'nextgen_cell_tx',
    name: 'Synthetic Cellular: Armored CAR-T (anti-MSLN) + IL-15 + PD-1 KO',
    category: 'cellular',
    drugs: ['Armored 4th Gen CAR-T + Subcutaneous IL-15 Superagonist'],
    description: 'Engineered cytotoxic T cells resistant to TGF-beta and PD-1, self-sustaining via transgenic cytokine secretion.',
    mechanism: 'Direct antigen-dependent killing independent of endogenous MHC-I presentation.',
    color: '#ec4899',
    baseParams: {
      antiPd1Dose: 50,
      antiCtla4Dose: 0,
      csf1rInhibitor: 0,
      tgfbBlocker: 60,
      stingAgonist: 20,
      ido1Inhibitor: 0,
      carTTiter: 90
    }
  }
];

export const InterventionScenarioSim: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('dual_checkpoint');
  const [customMode, setCustomMode] = useState<boolean>(false);

  // Custom dosage controls
  const [params, setParams] = useState(PRESET_SCENARIOS[2].baseParams);

  // Active scenario
  const currentScenario = useMemo(() => {
    return PRESET_SCENARIOS.find((s) => s.id === selectedScenarioId) || PRESET_SCENARIOS[0];
  }, [selectedScenarioId]);

  const handleSelectScenario = (sc: InterventionScenario) => {
    setSelectedScenarioId(sc.id);
    setParams(sc.baseParams);
    setCustomMode(false);
  };

  const handleParamChange = (key: keyof typeof params, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    setCustomMode(true);
  };

  // Run 180-day dynamic differential simulation
  const simulationData = useMemo(() => {
    const days = 180;
    const data = [];

    // Initial state
    let tumorBurden = 100.0; // 100% baseline
    let cd8EffectorCount = 250; // cells / mm3
    let immunosuppression = 80; // 0-100 index
    let exhaustion = 65; // 0-100 index
    let antigenRelease = 20;

    const {
      antiPd1Dose,
      antiCtla4Dose,
      csf1rInhibitor,
      tgfbBlocker,
      stingAgonist,
      ido1Inhibitor,
      carTTiter
    } = params;

    // Efficacy coefficients
    const checkpointReversal = (antiPd1Dose * 0.7 + antiCtla4Dose * 0.5) / 100;
    const stromaBreakdown = (tgfbBlocker * 0.6 + csf1rInhibitor * 0.5) / 100;
    const primingStrength = (stingAgonist * 0.8 + antiCtla4Dose * 0.6 + ido1Inhibitor * 0.4) / 100;
    const directCellLysis = (carTTiter * 0.9) / 100;

    for (let day = 0; day <= days; day += 5) {
      // 1. Calculate immunosuppression reduction
      immunosuppression = Math.max(
        10,
        80 - (stromaBreakdown * 50) - (antiCtla4Dose * 0.2) - (ido1Inhibitor * 0.15)
      );

      // 2. Priming & CD8 recruitment
      const primingRate = 15 * primingStrength + (antigenRelease * 0.4);
      const infiltrationBarrier = (immunosuppression / 100);
      const effectiveRecruitment = primingRate * (1 - infiltrationBarrier * 0.6) + (carTTiter * 6);

      // 3. Exhaustion dynamics
      exhaustion = Math.max(
        15,
        Math.min(95, 65 + (day * 0.15) - (checkpointReversal * 45))
      );

      // 4. CD8 population evolution
      const killPotency = (1 - exhaustion / 100) * (1 - immunosuppression / 150);
      cd8EffectorCount = Math.max(
        50,
        Math.min(1800, cd8EffectorCount + effectiveRecruitment * 2 - (cd8EffectorCount * 0.02))
      );

      // 5. Tumor Growth vs Clearance (Lotka-Volterra style ODE)
      const intrinsicTumorGrowth = (tumorBurden * 0.035) * (1 - tumorBurden / 300);
      const cytotoxicKilling = (cd8EffectorCount * 0.08 * killPotency) + (directCellLysis * 25);

      tumorBurden = Math.max(
        0,
        tumorBurden + intrinsicTumorGrowth - cytotoxicKilling
      );

      antigenRelease = Math.min(100, (cytotoxicKilling * 2.5) + (stingAgonist * 0.3));

      data.push({
        day,
        tumorBurden: parseFloat(tumorBurden.toFixed(1)),
        cd8Count: Math.round(cd8EffectorCount),
        immunosuppression: parseFloat(immunosuppression.toFixed(1)),
        exhaustion: parseFloat(exhaustion.toFixed(1)),
        antigenFlux: parseFloat(antigenRelease.toFixed(1))
      });
    }

    return data;
  }, [params]);

  // Derived clinical outcomes
  const latest = simulationData[simulationData.length - 1];
  const tumorReduction = ((100 - latest.tumorBurden) / 100) * 100;
  
  let recistResponse: 'CR' | 'PR' | 'SD' | 'PD' = 'PD';
  if (latest.tumorBurden <= 5) recistResponse = 'CR'; // Complete Response
  else if (tumorReduction >= 30) recistResponse = 'PR'; // Partial Response
  else if (latest.tumorBurden <= 120) recistResponse = 'SD'; // Stable Disease
  else recistResponse = 'PD'; // Progressive Disease

  // Hazard Ratio & Toxicity Risk estimates
  const estHazardRatio = Math.max(0.18, 1.0 - (tumorReduction * 0.0085)).toFixed(2);
  const toxicityScore = Math.min(
    95,
    Math.round(
      params.antiPd1Dose * 0.25 +
      params.antiCtla4Dose * 0.55 +
      params.csf1rInhibitor * 0.15 +
      params.tgfbBlocker * 0.2 +
      params.carTTiter * 0.45
    )
  );

  return (
    <div className="space-y-6">
      {/* Scenario Presets Selector */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-400" />
              Intervention Scenario & Multi-Arm Clinical Trials Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Simulate 180-day longitudinal tumor clearance, CD8+ effector influx, and TME barrier dismantling under combination immuno-oncology regimens.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold border ${
              recistResponse === 'CR' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
              recistResponse === 'PR' ? 'bg-cyan-950 text-cyan-300 border-cyan-700' :
              recistResponse === 'SD' ? 'bg-amber-950 text-amber-300 border-amber-700' :
              'bg-rose-950 text-rose-300 border-rose-700'
            }`}>
              RECIST 1.1: {recistResponse} ({tumorReduction > 0 ? `-${tumorReduction.toFixed(0)}%` : `+${Math.abs(tumorReduction).toFixed(0)}%`})
            </span>
          </div>
        </div>

        {/* Preset Cards Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {PRESET_SCENARIOS.map((scenario) => {
            const isSelected = selectedScenarioId === scenario.id && !customMode;
            return (
              <button
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario)}
                className={`p-3.5 rounded-xl text-left border transition-all space-y-2 ${
                  isSelected
                    ? 'bg-slate-800 border-purple-500/80 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold"
                    style={{ backgroundColor: `${scenario.color}20`, color: scenario.color }}
                  >
                    {scenario.category}
                  </span>
                  {isSelected && <CheckCircle className="w-3.5 h-3.5 text-purple-400" />}
                </div>

                <div className="font-bold text-xs text-white line-clamp-1">{scenario.name}</div>
                <div className="text-[11px] font-mono text-slate-400 line-clamp-1">{scenario.drugs.join(' + ')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Dynamic Time-Course Plots & Parameter Customizer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Recharts Graphs & Longitudinal Dynamics */}
        <div className="xl:col-span-8 space-y-6">
          {/* Chart 1: Tumor Burden & CD8+ Influx */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                  180-Day Longitudinal Tumor Burden vs. CD8+ Infiltration
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">ODE Kinetic Model</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="day"
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `D${val}`}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#f87171"
                    fontSize={11}
                    domain={[0, 'auto']}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#38bdf8"
                    fontSize={11}
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="tumorBurden"
                    name="Tumor Burden (% Baseline)"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cd8Count"
                    name="CD8+ T Cells (cells/mm³)"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Immunosuppression vs Exhaustion vs Antigen Release */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                  TME Suppressive Barrier & Exhaustion Index Trajectory
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Score 0–100 AU</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="day"
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `D${val}`}
                  />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="immunosuppression"
                    name="TME Suppressive Barrier"
                    stroke="#f59e0b"
                    fill="#f59e0b20"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="exhaustion"
                    name="T Cell Exhaustion Index"
                    stroke="#ec4899"
                    fill="#ec489920"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="antigenFlux"
                    name="Antigen Cross-Priming Flux"
                    stroke="#10b981"
                    fill="#10b98120"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Custom Parameter Tuning & Clinical Metrics */}
        <div className="xl:col-span-4 space-y-6">
          {/* Real-time Outcomes Panel */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center justify-between">
              <span>Predicted Clinical Endpoints</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">FINAL TUMOR LOAD</span>
                <div className={`text-lg font-mono font-bold ${latest.tumorBurden <= 20 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {latest.tumorBurden}%
                </div>
                <span className="text-[10px] text-slate-500 font-mono">at Day 180</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">EST. HAZARD RATIO</span>
                <div className="text-lg font-mono font-bold text-cyan-400">
                  {estHazardRatio}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">vs Control Arm</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">PEAK CD8+ DENSITY</span>
                <div className="text-lg font-mono font-bold text-indigo-400">
                  {Math.max(...simulationData.map(d => d.cd8Count))}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">cells / mm³</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">irAE TOXICITY RISK</span>
                <div className={`text-lg font-mono font-bold ${toxicityScore >= 60 ? 'text-rose-400' : toxicityScore >= 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {toxicityScore}%
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Grade 3/4 Risk</span>
              </div>
            </div>

            {/* Regimen Mechanism Explainer */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono text-purple-400 uppercase font-bold flex items-center gap-1.5">
                <Zap className="w-3 h-3" /> Targeted Molecular Mechanism
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentScenario.mechanism}
              </p>
            </div>
          </div>

          {/* Interactive Multi-Agent Cocktail Sliders */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">Multi-Agent Cocktail Sandbox</h4>
              </div>
              <button
                onClick={() => handleSelectScenario(currentScenario)}
                className="text-[10px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Anti-PD-1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Anti-PD-1 / Anti-PD-L1</span>
                  <span className="text-cyan-400 font-bold">{params.antiPd1Dose}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={params.antiPd1Dose}
                  onChange={(e) => handleParamChange('antiPd1Dose', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Anti-CTLA-4 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Anti-CTLA-4 (Ipilimumab)</span>
                  <span className="text-purple-400 font-bold">{params.antiCtla4Dose}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={params.antiCtla4Dose}
                  onChange={(e) => handleParamChange('antiCtla4Dose', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>

              {/* CSF-1R Inhibitor */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">CSF-1R-i (M2 TAM Repolarizer)</span>
                  <span className="text-amber-400 font-bold">{params.csf1rInhibitor}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={params.csf1rInhibitor}
                  onChange={(e) => handleParamChange('csf1rInhibitor', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* TGF-beta Blocker */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Anti-TGF-β / FAK-i (CAF Barrier)</span>
                  <span className="text-emerald-400 font-bold">{params.tgfbBlocker}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={params.tgfbBlocker}
                  onChange={(e) => handleParamChange('tgfbBlocker', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* STING Agonist */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">STING Agonist (cDC1 Cross-Primer)</span>
                  <span className="text-rose-400 font-bold">{params.stingAgonist}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={params.stingAgonist}
                  onChange={(e) => handleParamChange('stingAgonist', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
              </div>

              {/* CAR-T Titer */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Adoptive CAR-T / TCR-T Titer</span>
                  <span className="text-pink-400 font-bold">{params.carTTiter}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={params.carTTiter}
                  onChange={(e) => handleParamChange('carTTiter', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
