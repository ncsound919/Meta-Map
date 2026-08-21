import React, { useState } from 'react';
import { Slider } from '../../ui/Slider';

import {
  Brain,
  Zap,
  Activity,
  Sliders,
  Shield,
  Layers,
  Network,
  CheckCircle2,
  Lock,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export const BrainNicheEngine: React.FC = () => {
  const [bbbIntegrity, setBbbIntegrity] = useState<number>(65); // 0-100%
  const [l1camCooption, setL1camCooption] = useState<number>(80); // L1CAM expression %
  const [cx43GapJunctions, setCx43GapJunctions] = useState<number>(75); // Connexin-43 coupling
  const [astrocyticStat3, setAstrocyticStat3] = useState<number>(85); // STAT3 phosphorylation in reactive astrocytes
  const [activeDrug, setActiveDrug] = useState<'none' | 'tucatinib' | 'meclofenamate' | 'stat3_inh' | 'abemaciclib'>('none');

  // Brain Niche Computations
  const vascularCooptionRate = Math.max(
    10,
    Math.round(
      (l1camCooption * 0.7 + (100 - bbbIntegrity) * 0.3) *
      (activeDrug === 'meclofenamate' ? 0.35 : 1.0)
    )
  );

  const cGampTransferFlux = Math.max(
    5,
    Math.round(
      (cx43GapJunctions * 0.8) *
      (activeDrug === 'meclofenamate' ? 0.15 : 1.0)
    )
  );

  const astrocyteCytokineShield = Math.max(
    10,
    Math.round(
      (astrocyticStat3 * 0.6 + cGampTransferFlux * 0.4) *
      (activeDrug === 'stat3_inh' ? 0.25 : activeDrug === 'tucatinib' ? 0.5 : 1.0)
    )
  );

  const intracranialColonizationIndex = Math.min(
    100,
    Math.round(
      (vascularCooptionRate * 0.4 + astrocyteCytokineShield * 0.4 + (100 - bbbIntegrity) * 0.2) *
      (activeDrug === 'abemaciclib' ? 0.4 : activeDrug === 'tucatinib' ? 0.3 : 1.0)
    )
  );

  const radarData = [
    { metric: 'Vascular Co-option (L1CAM)', value: vascularCooptionRate, fullMark: 100 },
    { metric: 'Astrocyte Cx43 Coupling', value: cGampTransferFlux, fullMark: 100 },
    { metric: 'Reactive Astrogliosis (STAT3)', value: astrocyteCytokineShield, fullMark: 100 },
    { metric: 'BBB Disruption Index', value: 100 - bbbIntegrity, fullMark: 100 },
    { metric: 'Synaptic / NMDA Hijack', value: Math.round(astrocyticStat3 * 0.7), fullMark: 100 }
  ];

  const temporalBrainData = [
    { day: 'Day 0 (Arrest)', dormantCells: 50, perivascularSpread: 10, astrocyteActivation: 15 },
    { day: 'Day 15 (L1CAM Spread)', dormantCells: 45, perivascularSpread: 35, astrocyteActivation: 40 },
    { day: 'Day 30 (Cx43 Hijack)', dormantCells: 80, perivascularSpread: vascularCooptionRate * 0.7, astrocyteActivation: astrocyteCytokineShield * 0.6 },
    { day: 'Day 60 (Micromet)', dormantCells: 320, perivascularSpread: vascularCooptionRate * 0.9, astrocyteActivation: astrocyteCytokineShield * 0.85 },
    { day: 'Day 90 (Macromet)', dormantCells: 1450, perivascularSpread: vascularCooptionRate, astrocyteActivation: astrocyteCytokineShield }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Brain Metastatic Niche & Neurovascular Unit (NVU) Simulator</h3>
              <p className="text-xs text-slate-400">
                Simulates L1CAM pericyte displacement, Cx43 gap junction cGAMP paracrine loops, and reactive astrocyte immunosuppression.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-bold">
            PARENCHYMAL COMPLIANCE: E ≈ 0.2–1.0 kPa (Ultra-Soft)
          </span>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">VASCULAR CO-OPTION</span>
            <strong className="text-lg font-bold font-mono text-indigo-400">{vascularCooptionRate}%</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">cGAMP / Cx43 TRANSFER</span>
            <strong className="text-lg font-bold font-mono text-cyan-400">{cGampTransferFlux} AU</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">ASTROCYTE SHIELD (STAT3)</span>
            <strong className="text-lg font-bold font-mono text-purple-400">{astrocyteCytokineShield}%</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">COLONIZATION PROBABILITY</span>
            <strong className={`text-lg font-bold font-mono ${intracranialColonizationIndex > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {intracranialColonizationIndex}%
            </strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Molecular Mechanics & Radar / Temporal Models */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Mechanics & Radar */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-indigo-400" /> Neurovascular Unit & Astrocytic Shield Mechanisms
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-indigo-300">1. L1CAM Pericyte Co-option</strong>
                  <span className="text-slate-500">Adhesion</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  DTCs spread along the abluminal surface of brain microvessels, displacing pericytes via L1CAM-integrin beta1 signaling.
                </p>
                <div className="text-[10px] font-mono text-indigo-400/90 pt-1">
                  Co-option Level: {vascularCooptionRate}%
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-cyan-300">2. Connexin-43 Channels</strong>
                  <span className="text-slate-500">Paracrine</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tumor-astrocyte gap junctions transfer second messenger 2'3'-cGAMP to astrocytes, turning on STING and secreting TNF-alpha and IFN-alpha.
                </p>
                <div className="text-[10px] font-mono text-cyan-400/90 pt-1">
                  Channel Flux: {cGampTransferFlux} AU
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-purple-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-purple-300">3. STAT3 Reactive Astrogliosis</strong>
                  <span className="text-slate-500">Survival</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Astrocytic STAT3 phosphorylation induces neuroprotective cytokine production that guards DTCs against innate microglial attack.
                </p>
                <div className="text-[10px] font-mono text-purple-400/90 pt-1">
                  STAT3 Activation: {astrocyticStat3}%
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-rose-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-rose-300">4. Serpin / FasL Shield</strong>
                  <span className="text-slate-500">Evasion</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tumor-derived neuroserpin & serpin B2 inhibit plasmin-mediated FasL generation, blocking astrocyte-induced apoptosis.
                </p>
                <div className="text-[10px] font-mono text-rose-400/90 pt-1">
                  Apoptosis Resistance: {100 - (activeDrug === 'tucatinib' ? 50 : 20)}%
                </div>
              </div>
            </div>

            {/* Radar & Line Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-2">Brain Tropism Niche Vector:</span>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 9 }} />
                      <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                      <Radar name="Niche Metrics" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 block mb-2">90-Day Parenchymal Colonization:</span>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={temporalBrainData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 9 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                      <Line type="monotone" dataKey="dormantCells" name="Tumor Cells" stroke="#f43f5e" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="perivascularSpread" name="Vascular Co-option" stroke="#818cf8" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls & Brain-Penetrant Therapies */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h4 className="font-bold text-sm text-white">Neuro-Vascular Parameters</h4>
            </div>

            {/* BBB Integrity */}
            <Slider
  label="Blood-Brain Barrier Integrity:"
  min={10}
  max={100}
  step={5}
  value={bbbIntegrity}
  onChange={setBbbIntegrity}
  valueDisplay={<>{bbbIntegrity}%</>}
/>

            {/* L1CAM Co-option */}
            <Slider
  label="L1CAM Vascular Spreading Expression:"
  min={10}
  max={100}
  step={5}
  value={l1camCooption}
  onChange={setL1camCooption}
  valueDisplay={<>{l1camCooption}%</>}
/>

            {/* Cx43 Gap Junctions */}
            <Slider
  label="Connexin-43 Coupling to Astrocytes:"
  min={5}
  max={100}
  step={5}
  value={cx43GapJunctions}
  onChange={setCx43GapJunctions}
  valueDisplay={<>{cx43GapJunctions}%</>}
/>

            {/* Astrocytic STAT3 */}
            <Slider
  label="Astrocyte STAT3 Phosphorylation:"
  min={10}
  max={100}
  step={5}
  value={astrocyticStat3}
  onChange={setAstrocyticStat3}
  valueDisplay={<>{astrocyticStat3}%</>}
/>
          </div>

          {/* Brain Penetrant Interventions */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h4 className="font-bold text-sm text-white">Brain-Penetrant Interventions</h4>
            </div>

            <div className="space-y-2">
              {[
                { id: 'none', label: 'Untreated (Unrestricted Parenchymal Colonization)', desc: 'Full NVU co-option and astrocytic shield.' },
                { id: 'meclofenamate', label: 'Meclofenamate / Tonabersat (Cx43 Inh)', desc: 'Blocks tumor-astrocyte gap junctions, halting cGAMP transfer.' },
                { id: 'stat3_inh', label: 'Silmitasertib / STAT3 Inhibitor (WP1066)', desc: 'Disables the neuroprotective reactive astrogliosis cytokine shield.' },
                { id: 'tucatinib', label: 'Tucatinib + Trastuzumab (BBB-Penetrant)', desc: 'Selective HER2 kinase inhibitor with potent CNS penetration.' },
                { id: 'abemaciclib', label: 'Abemaciclib (CDK4/6 Inhibitor CNS)', desc: 'Crosses intact BBB to enforce G1 cell cycle arrest on brain DTCs.' }
              ].map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => setActiveDrug(tx.id as any)}
                  className={`w-full p-3 rounded-xl text-left border text-xs transition-all ${
                    activeDrug === tx.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold font-mono text-xs flex justify-between items-center">
                    <span>{tx.label}</span>
                    {activeDrug === tx.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
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
