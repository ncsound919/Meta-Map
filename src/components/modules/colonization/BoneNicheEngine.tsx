import React, { useState, useEffect } from 'react';
import { Slider } from '../../ui/Slider';

import {
  Bone,
  Brain,
  Activity,
  Sliders,
  Zap,
  Shield,
  Layers,
  Sparkles,
  Flame,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import {
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

export const BoneNicheEngine: React.FC = () => {
  const [osteoclastActivity, setOsteoclastActivity] = useState<number>(75); // 0-100%
  const [tgfBetaConcentration, setTgfBetaConcentration] = useState<number>(68); // ng/mL release
  const [ranklToOpgRatio, setRanklToOpgRatio] = useState<number>(4.2); // normal ~ 1.0, osteolytic > 3.0
  const [calciumSensingCaSr, setCalciumSensingCaSr] = useState<number>(80); // % activation in resorption pits
  const [activeDrug, setActiveDrug] = useState<'none' | 'zoledronic_acid' | 'denosumab' | 'radium223' | 'cabozantinib'>('none');

  // Vicious Cycle Computations
  const computedResorptionRate = Math.max(
    5,
    Math.round(
      (osteoclastActivity * 0.5 + ranklToOpgRatio * 12) *
      (activeDrug === 'zoledronic_acid' ? 0.2 : activeDrug === 'denosumab' ? 0.15 : 1.0)
    )
  );

  const boneMatrixTgfBetaRelease = Math.max(
    10,
    Math.round(
      (tgfBetaConcentration * (computedResorptionRate / 50)) *
      (activeDrug === 'cabozantinib' ? 0.4 : 1.0)
    )
  );

  const tumorPTHrPStimulation = Math.round((boneMatrixTgfBetaRelease * 1.3) + (calciumSensingCaSr * 0.4));
  const osteolyticDestructionScore = Math.min(100, Math.round(computedResorptionRate * 0.7 + tumorPTHrPStimulation * 0.3));
  const osteoblastMineralization = Math.max(
    5,
    Math.round(
      (80 - computedResorptionRate * 0.6) *
      (activeDrug === 'radium223' ? 1.4 : 1.0)
    )
  );

  // Time-series cycle dynamic data
  const cycleData = [
    { month: 'M0 (Arrest)', dtcCount: 10, resorptionIndex: 20, matrixTgf: 15, boneDensity: 95 },
    { month: 'M3 (Endosteal)', dtcCount: 25, resorptionIndex: 35, matrixTgf: 28, boneDensity: 90 },
    { month: 'M6 (Awakening)', dtcCount: 120, resorptionIndex: computedResorptionRate * 0.6, matrixTgf: boneMatrixTgfBetaRelease * 0.5, boneDensity: 82 },
    { month: 'M9 (Vicious Loop)', dtcCount: 540, resorptionIndex: computedResorptionRate * 0.85, matrixTgf: boneMatrixTgfBetaRelease * 0.8, boneDensity: 71 },
    { month: 'M12 (Lytic Lesion)', dtcCount: 1850, resorptionIndex: computedResorptionRate, matrixTgf: boneMatrixTgfBetaRelease, boneDensity: Math.max(30, 95 - osteolyticDestructionScore * 0.6) }
  ];

  return (
    <div className="space-y-6">
      {/* Overview & Vicious Cycle Summary */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bone className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Bone Endosteal & Osteolytic Vicious Cycle Engine</h3>
              <p className="text-xs text-slate-400">
                Models reciprocal feedback between metastatic DTCs, osteoclast bone resorption, matrix-bound TGF-$\beta$, and calcium-sensing receptors.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
            MATRIX STIFFNESS: 15 GPa (Cortical) / 250 MPa (Cancellous)
          </span>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">RESORPTION RATE</span>
            <strong className="text-lg font-bold font-mono text-amber-400">{computedResorptionRate} μm³/day</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">MATRIX TGF-β RELEASE</span>
            <strong className="text-lg font-bold font-mono text-rose-400">{boneMatrixTgfBetaRelease} ng/mL</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">TUMOR PTHrP FLUX</span>
            <strong className="text-lg font-bold font-mono text-purple-400">{tumorPTHrPStimulation} pmol/L</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">OSTEOLYSIS SEVERITY</span>
            <strong className={`text-lg font-bold font-mono ${osteolyticDestructionScore > 65 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {osteolyticDestructionScore}/100
            </strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">MINERALIZATION RATE</span>
            <strong className="text-lg font-bold font-mono text-cyan-400">{osteoblastMineralization}%</strong>
          </div>
        </div>
      </div>

      {/* Interactive Loop Diagram & Time Series Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Vicious Cycle Visual Nodes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Vicious Cycle Molecular Axis
            </h4>

            {/* 4-Node Feedback Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-amber-300">1. Tumor Cell PTHrP</strong>
                  <span className="text-slate-500">Stimulator</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  DTCs secrete PTHrP & IL-6/IL-11, signaling osteoblasts to upregulate RANKL and suppress OPG.
                </p>
                <div className="text-[10px] font-mono text-amber-400/90 pt-1">
                  RANKL/OPG Ratio: {ranklToOpgRatio.toFixed(1)}x
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-rose-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-rose-300">2. Osteoclast Differentiation</strong>
                  <span className="text-slate-500">Resorption</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  RANKL binds RANK on pre-osteoclasts, driving NFATc1 activation and mature osteoclast bone erosion.
                </p>
                <div className="text-[10px] font-mono text-rose-400/90 pt-1">
                  Pits: {computedResorptionRate} μm³/day
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-purple-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-purple-300">3. Matrix Growth Factor Release</strong>
                  <span className="text-slate-500">Feed-Forward</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Acid & Cathepsin K dissolve hydroxyapatite, liberating trapped TGF-$\beta$, IGF-1, and bone morphogenetic proteins (BMPs).
                </p>
                <div className="text-[10px] font-mono text-purple-400/90 pt-1">
                  TGF-β: {boneMatrixTgfBetaRelease} ng/mL
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-emerald-300">4. CaSR & Smad2/3 Activation</strong>
                  <span className="text-slate-500">Proliferation</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  High extracellular Calcium (Ca2+ 10–40 mM) and matrix TGF-beta trigger SMAD2/3 and MAPK signaling, fueling exponential colonization.
                </p>
                <div className="text-[10px] font-mono text-emerald-400/90 pt-1">
                  CaSR Activation: {calciumSensingCaSr}%
                </div>
              </div>
            </div>

            {/* Progression Chart */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-2">12-Month Colonization vs Bone Density Loss Trajectory:</span>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cycleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="dtcCount" name="Tumor Cell Count" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="boneDensity" name="Bone Mineral Density %" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="resorptionIndex" name="Resorption Index" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Parameters & Target Interventions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-sm text-white">Bone Niche Biochemical Tuners</h4>
            </div>

            {/* RANKL / OPG Ratio */}
            <Slider
  label="RANKL to OPG Ratio:"
  min={0.5}
  max={8.0}
  step={0.2}
  value={ranklToOpgRatio}
  onChange={setRanklToOpgRatio}
  valueDisplay={<>{ranklToOpgRatio.toFixed(1)}x</>}
/>

            {/* Osteoclast Activity */}
            <Slider
  label="Osteoclast Basal Activity:"
  min={10}
  max={100}
  step={5}
  value={osteoclastActivity}
  onChange={setOsteoclastActivity}
  valueDisplay={<>{osteoclastActivity}%</>}
/>

            {/* Matrix TGF-beta Concentration */}
            <Slider
  label="Matrix-Bound TGF-β Reservoir:"
  min={10}
  max={120}
  step={5}
  value={tgfBetaConcentration}
  onChange={setTgfBetaConcentration}
  valueDisplay={<>{tgfBetaConcentration} ng/mL</>}
/>

            {/* CaSR Sensor */}
            <Slider
  label="Calcium-Sensing Receptor (CaSR):"
  min={20}
  max={100}
  step={5}
  value={calciumSensingCaSr}
  onChange={setCalciumSensingCaSr}
  valueDisplay={<>{calciumSensingCaSr}%</>}
/>
          </div>

          {/* Targeted Bone Niche Therapeutics */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-sm text-white">Niche Disruption Interventions</h4>
            </div>

            <div className="space-y-2">
              {[
                { id: 'none', label: 'Untreated (Active Vicious Loop)', desc: 'Standard osteolytic progression.' },
                { id: 'denosumab', label: 'Denosumab (Anti-RANKL mAb)', desc: 'Blocks osteoclast formation & stops matrix bone dissolution.' },
                { id: 'zoledronic_acid', label: 'Zoledronic Acid (Bisphosphonate)', desc: 'Inhibits farnesyl pyrophosphate synthase in osteoclasts, inducing apoptosis.' },
                { id: 'radium223', label: 'Radium-223 (Alpha Emitter)', desc: 'Calcium mimetic binding hydroxyapatite, delivering targeted alpha radiation.' },
                { id: 'cabozantinib', label: 'Cabozantinib (c-MET / VEGFR2 / AXL)', desc: 'Suppresses tumor-osteoblast crosstalk and osteolytic lesion expansion.' }
              ].map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => setActiveDrug(tx.id as any)}
                  className={`w-full p-3 rounded-xl text-left border text-xs transition-all ${
                    activeDrug === tx.id
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold font-mono text-xs flex justify-between items-center">
                    <span>{tx.label}</span>
                    {activeDrug === tx.id && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{tx.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
