import React, { useState } from 'react';
import { Slider } from '../../ui/Slider';

import {
  Wind,
  Activity,
  Sliders,
  Shield,
  Layers,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Zap,
  Sparkles,
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

export const LungNicheEngine: React.FC = () => {
  const [tenascinCPetriostin, setTenascinCPetriostin] = useState<number>(70); // POSTN / TNC levels %
  const [netFormation, setNetFormation] = useState<number>(65); // Neutrophil Extracellular Trap density %
  const [tsp1Dormancy, setTsp1Dormancy] = useState<number>(40); // Endothelial Thrombospondin-1 %
  const [cyclicStretch, setCyclicStretch] = useState<number>(50); // Alveolar strain / breathing frequency %
  const [activeDrug, setActiveDrug] = useState<'none' | 'dnase1' | 'tasquinimod' | 'loxl2_inh' | 'tsp1_mimetic'>('none');

  // Lung Niche Computations
  const netAwakeningScore = Math.max(
    5,
    Math.round(
      (netFormation * 0.8 + (100 - tsp1Dormancy) * 0.4) *
      (activeDrug === 'dnase1' ? 0.15 : activeDrug === 'tasquinimod' ? 0.35 : 1.0)
    )
  );

  const wntStemnessNiche = Math.max(
    10,
    Math.round(
      (tenascinCPetriostin * 0.85) *
      (activeDrug === 'loxl2_inh' ? 0.4 : 1.0)
    )
  );

  const angiogenicSwitchProbability = Math.max(
    5,
    Math.min(
      100,
      Math.round(
        (netAwakeningScore * 0.5 + wntStemnessNiche * 0.4 - (tsp1Dormancy * 0.5)) *
        (activeDrug === 'tsp1_mimetic' ? 0.2 : 1.0)
      )
    )
  );

  const lungColonizationIndex = Math.min(
    100,
    Math.round((netAwakeningScore * 0.35 + wntStemnessNiche * 0.35 + angiogenicSwitchProbability * 0.3))
  );

  const timeSeriesLungData = [
    { day: 'Day 0 (Capillary Trap)', dormantDtc: 100, micrometastasis: 0, netDensity: 40, wntSignal: 30 },
    { day: 'Day 10 (POSTN Niche)', dormantDtc: 85, micrometastasis: 15, netDensity: netFormation * 0.6, wntSignal: wntStemnessNiche * 0.5 },
    { day: 'Day 30 (NET Awakening)', dormantDtc: 40, micrometastasis: 110, netDensity: netFormation * 0.9, wntSignal: wntStemnessNiche * 0.8 },
    { day: 'Day 60 (Angio-Switch)', dormantDtc: 10, micrometastasis: 520, netDensity: netFormation, wntSignal: wntStemnessNiche },
    { day: 'Day 90 (Nodule Outgrowth)', dormantDtc: 2, micrometastasis: 2400, netDensity: netFormation, wntSignal: wntStemnessNiche }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Pulmonary Niche & Alveolar Dormancy-Awakening Simulator</h3>
              <p className="text-xs text-slate-400">
                Models Tenascin-C/Periostin Wnt retention, Neutrophil Extracellular Traps (NETs) matrix remodeling, and TSP-1 dormancy tipping points.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
            PULMONARY TRANSIT: 5–8 μm Alveolar Capillaries
          </span>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">NET AWAKENING SIGNAL</span>
            <strong className="text-lg font-bold font-mono text-rose-400">{netAwakeningScore} AU</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">POSTN / WNT RETENTION</span>
            <strong className="text-lg font-bold font-mono text-cyan-400">{wntStemnessNiche}%</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">ANGIOGENIC SWITCH PROB</span>
            <strong className="text-lg font-bold font-mono text-amber-400">{angiogenicSwitchProbability}%</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">PULMONARY COLONIZATION</span>
            <strong className={`text-lg font-bold font-mono ${lungColonizationIndex > 55 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {lungColonizationIndex}/100
            </strong>
          </div>
        </div>
      </div>

      {/* Grid: Pulmonary Mechanisms & Time Series */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Mechanics Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" /> Pulmonary Dormancy vs Awakening Axes
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-cyan-300">1. Tenascin-C & Periostin</strong>
                  <span className="text-slate-500">Soil</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  DTCs and CAFs produce TNC and POSTN to concentrate Wnt ligands, maintaining stem-like tumor-initiating capacity in the lung.
                </p>
                <div className="text-[10px] font-mono text-cyan-400/90 pt-1">
                  POSTN Niche Score: {tenascinCPetriostin}%
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-rose-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-rose-300">2. NET Awakening Proteases</strong>
                  <span className="text-slate-500">Awakening</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Inflammation-induced NETs release NE and MMP-9, sequentially cleaving laminin to reveal an epitope that binds integrin alpha3-beta1.
                </p>
                <div className="text-[10px] font-mono text-rose-400/90 pt-1">
                  Awakening Flux: {netAwakeningScore} AU
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-emerald-300">3. TSP-1 Capillary Quiescence</strong>
                  <span className="text-slate-500">Dormancy</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Mature, stable lung capillaries secrete Thrombospondin-1 (TSP-1), keeping single DTCs quiescent in G0/G1 arrest.
                </p>
                <div className="text-[10px] font-mono text-emerald-400/90 pt-1">
                  Dormancy Enforcement: {tsp1Dormancy}%
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-amber-300">4. Alveolar Cyclic Strain</strong>
                  <span className="text-slate-500">Biomechanics</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Physiological breathing creates cyclic stretch (0.2–0.5 Hz), stimulating Piezo1/YAP mechanotransduction in metastatic seeds.
                </p>
                <div className="text-[10px] font-mono text-amber-400/90 pt-1">
                  Mechanical Strain: {cyclicStretch}%
                </div>
              </div>
            </div>

            {/* Time Series Chart */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-2">90-Day Dormancy Exit & Outgrowth Progression:</span>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesLungData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="dormantDtc" name="Quiescent Dormant DTCs" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="micrometastasis" name="Awakened Micrometastases" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="netDensity" name="NET Density %" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Parameters & Interventions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-sm text-white">Pulmonary Parameters</h4>
            </div>

            {/* POSTN / TNC */}
            <Slider
  label="Periostin (POSTN) / Tenascin-C Matrix:"
  min={10}
  max={100}
  step={5}
  value={tenascinCPetriostin}
  onChange={setTenascinCPetriostin}
  valueDisplay={<>{tenascinCPetriostin}%</>}
/>

            {/* NET Density */}
            <Slider
  label="Neutrophil Extracellular Traps (NETs):"
  min={0}
  max={100}
  step={5}
  value={netFormation}
  onChange={setNetFormation}
  valueDisplay={<>{netFormation}%</>}
/>

            {/* TSP-1 Quiescence */}
            <Slider
  label="Thrombospondin-1 (TSP-1) Dormancy Field:"
  min={10}
  max={100}
  step={5}
  value={tsp1Dormancy}
  onChange={setTsp1Dormancy}
  valueDisplay={<>{tsp1Dormancy}%</>}
/>

            {/* Cyclic Stretch */}
            <Slider
  label="Alveolar Cyclic Respiration Strain:"
  min={10}
  max={100}
  step={5}
  value={cyclicStretch}
  onChange={setCyclicStretch}
  valueDisplay={<>{cyclicStretch}%</>}
/>
          </div>

          {/* Lung Interventions */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-sm text-white">Pulmonary Interception Therapies</h4>
            </div>

            <div className="space-y-2">
              {[
                { id: 'none', label: 'Untreated (Unimpeded Pulmonary Colonization)', desc: 'NET-mediated awakening and rapid angiogenic outgrowth.' },
                { id: 'dnase1', label: 'Inhaled DNase I (Pulmozyme / NET Digest)', desc: 'Enzymatically dismantles DNA web scaffolding of NETs, blocking awakening.' },
                { id: 'tasquinimod', label: 'Tasquinimod (S100A8/A9 Alarmin Blocker)', desc: 'Blocks myeloid cell recruitment and inflammatory alarmin signaling.' },
                { id: 'loxl2_inh', label: 'Simtuzumab (LOXL2 Collagen Crosslink Inh)', desc: 'Prevents pre-metastatic fibrotic stiffening and POSTN deposition.' },
                { id: 'tsp1_mimetic', label: 'TSP-1 Peptide Mimetic (ABT-510)', desc: 'Enforces microvascular endothelial quiescence, locking DTCs in dormancy.' }
              ].map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => setActiveDrug(tx.id as any)}
                  className={`w-full p-3 rounded-xl text-left border text-xs transition-all ${
                    activeDrug === tx.id
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold font-mono text-xs flex justify-between items-center">
                    <span>{tx.label}</span>
                    {activeDrug === tx.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
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
