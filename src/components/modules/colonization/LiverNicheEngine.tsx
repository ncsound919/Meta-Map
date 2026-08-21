import React, { useState } from 'react';
import { Slider } from '../../ui/Slider';

import {
  Activity,
  Sliders,
  Shield,
  Layers,
  CheckCircle2,
  TrendingUp,
  Droplets,
  Flame,
  Zap,
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
  AreaChart,
  Area
} from 'recharts';

export const LiverNicheEngine: React.FC = () => {
  const [kupfferPhagocytosis, setKupfferPhagocytosis] = useState<number>(45); // Kupffer cell clearance rate %
  const [hscActivation, setHscActivation] = useState<number>(75); // Hepatic Stellate Cell myofibroblast transition %
  const [hgfMetSignaling, setHgfMetSignaling] = useState<number>(80); // HGF / c-MET flux %
  const [sinusoidalFenestrae, setSinusoidalFenestrae] = useState<number>(60); // LSEC fenestration permeability %
  const [activeDrug, setActiveDrug] = useState<'none' | 'pirfenidone' | 'capmatinib' | 'bemcentinib' | 'atezo_bev'>('none');

  // Mathematical Niche Calculations
  const desmoplasticStiffness = Math.min(
    25,
    Math.round(
      (1.5 + (hscActivation * 0.22)) *
      (activeDrug === 'pirfenidone' ? 0.4 : 1.0)
    )
  ); // kPa

  const kupfferEscapeRate = Math.max(
    5,
    Math.round(
      (100 - kupfferPhagocytosis) * (sinusoidalFenestrae / 100) *
      (activeDrug === 'atezo_bev' ? 0.35 : 1.0)
    )
  );

  const hepatocyteSurvivalFlux = Math.max(
    10,
    Math.round(
      (hgfMetSignaling * 0.6 + desmoplasticStiffness * 2.5) *
      (activeDrug === 'capmatinib' ? 0.2 : activeDrug === 'bemcentinib' ? 0.35 : 1.0)
    )
  );

  const liverColonizationScore = Math.min(
    100,
    Math.round(
      (kupfferEscapeRate * 0.35 + hepatocyteSurvivalFlux * 0.45 + (hscActivation * 0.2)) *
      (activeDrug === 'capmatinib' ? 0.3 : activeDrug === 'pirfenidone' ? 0.5 : 1.0)
    )
  );

  const timeSeriesLiverData = [
    { week: 'W0 (Sinusoid)', dtcCount: 100, fibroticStiffness: 1.5, kupfferClearance: 85, metSurvival: 20 },
    { week: 'W2 (Extravasate)', dtcCount: 40, fibroticStiffness: 3.2, kupfferClearance: 60, metSurvival: 35 },
    { week: 'W4 (HSC Awake)', dtcCount: 85, fibroticStiffness: desmoplasticStiffness * 0.5, kupfferClearance: 40, metSurvival: hepatocyteSurvivalFlux * 0.6 },
    { week: 'W8 (Micromet)', dtcCount: 380, fibroticStiffness: desmoplasticStiffness * 0.8, kupfferClearance: 25, metSurvival: hepatocyteSurvivalFlux * 0.85 },
    { week: 'W12 (Macromet)', dtcCount: 1950, fibroticStiffness: desmoplasticStiffness, kupfferClearance: 12, metSurvival: hepatocyteSurvivalFlux }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Liver Sinusoidal & Hepatic Stellate Desmoplasia Simulator</h3>
              <p className="text-xs text-slate-400">
                Simulates Kupffer cell immune checkpoint clearance, HSC myofibroblast conversion, collagen deposition, and HGF/c-MET survival loops.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
            HEALTHY PARENCHYMA: 1.5 kPa → DESMOPLASTIC MET: {desmoplasticStiffness} kPa
          </span>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">KUPFFER ESCAPE RATE</span>
            <strong className="text-lg font-bold font-mono text-amber-400">{kupfferEscapeRate}%</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">DESMOPLASTIC STIFFNESS</span>
            <strong className="text-lg font-bold font-mono text-rose-400">{desmoplasticStiffness} kPa</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">HGF / MET SURVIVAL FLUX</span>
            <strong className="text-lg font-bold font-mono text-cyan-400">{hepatocyteSurvivalFlux} AU</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">LIVER MET EXPANSION</span>
            <strong className={`text-lg font-bold font-mono ${liverColonizationScore > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {liverColonizationScore}/100
            </strong>
          </div>
        </div>
      </div>

      {/* Grid: Mechanisms and Dynamics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Niche Blocks */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Liver Niche Molecular Cascade
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-emerald-300">1. Sinusoidal Extravasation</strong>
                  <span className="text-slate-500">Homing</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  CTCs utilize Claudin-2 to adhere to LSECs and squeeze through 100–150 nm endothelial fenestrations into the Space of Disse.
                </p>
                <div className="text-[10px] font-mono text-emerald-400/90 pt-1">
                  Fenestration Permeability: {sinusoidalFenestrae}%
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-amber-300">2. Kupffer Cell Immune Filter</strong>
                  <span className="text-slate-500">Clearance</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Resident sinusoidal macrophages phagocytose over 80% of arriving CTCs unless tumor CD47 ("don't eat me") halts engulfment.
                </p>
                <div className="text-[10px] font-mono text-amber-400/90 pt-1">
                  Active Phagocytosis: {kupfferPhagocytosis}%
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-rose-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-rose-300">3. HSC Myofibroblast Niche</strong>
                  <span className="text-slate-500">Desmoplasia</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Quiescent vitamin A-storing HSCs transform into alpha-SMA+ myofibroblasts, depositing dense Collagen I/IV and Fibronectin.
                </p>
                <div className="text-[10px] font-mono text-rose-400/90 pt-1">
                  HSC Activation: {hscActivation}%
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-cyan-300">4. HGF / c-MET Proliferation</strong>
                  <span className="text-slate-500">Mitogenesis</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Stroma-derived Hepatocyte Growth Factor binds tumor c-MET, inducing PI3K/Akt and MEK/ERK survival signaling.
                </p>
                <div className="text-[10px] font-mono text-cyan-400/90 pt-1">
                  c-MET Flux: {hgfMetSignaling}%
                </div>
              </div>
            </div>

            {/* Time Series Area Chart */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-2">12-Week Hepatic Colonization & Fibrotic Stiffening Dynamics:</span>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesLiverData}>
                    <defs>
                      <linearGradient id="colorDtc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="dtcCount" name="Viable Metastatic Cells" stroke="#f43f5e" fillOpacity={1} fill="url(#colorDtc)" />
                    <Line type="monotone" dataKey="fibroticStiffness" name="Tissue Stiffness (kPa)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Parameters & Liver-Directed Interventions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">Hepatic Microenvironment Controls</h4>
            </div>

            {/* Kupffer Phagocytosis */}
            <Slider
  label="Kupffer Cell Phagocytic Clearance:"
  min={5}
  max={95}
  step={5}
  value={kupfferPhagocytosis}
  onChange={setKupfferPhagocytosis}
  valueDisplay={<>{kupfferPhagocytosis}%</>}
/>

            {/* HSC Activation */}
            <Slider
  label="Hepatic Stellate Cell Activation:"
  min={10}
  max={100}
  step={5}
  value={hscActivation}
  onChange={setHscActivation}
  valueDisplay={<>{hscActivation}%</>}
/>

            {/* HGF/MET Flux */}
            <Slider
  label="HGF / c-MET Paracrine Pathway:"
  min={10}
  max={100}
  step={5}
  value={hgfMetSignaling}
  onChange={setHgfMetSignaling}
  valueDisplay={<>{hgfMetSignaling}%</>}
/>

            {/* Fenestrations */}
            <Slider
  label="Sinusoidal Fenestrations (Space of Disse):"
  min={10}
  max={100}
  step={5}
  value={sinusoidalFenestrae}
  onChange={setSinusoidalFenestrae}
  valueDisplay={<>{sinusoidalFenestrae}%</>}
/>
          </div>

          {/* Liver Interventions */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">Liver Niche Interception Therapies</h4>
            </div>

            <div className="space-y-2">
              {[
                { id: 'none', label: 'Untreated (Permissive Hepatic Niche)', desc: 'Desmoplastic transformation & rapid metastasis.' },
                { id: 'pirfenidone', label: 'Pirfenidone (Anti-Fibrotic HSC Inactivator)', desc: 'Blocks TGF-β1 collagen synthesis, normalizing parenchymal compliance.' },
                { id: 'capmatinib', label: 'Capmatinib (High-Selectivity c-MET Inhibitor)', desc: 'Shuts down stroma-driven HGF/MET mitogenic and survival loops.' },
                { id: 'bemcentinib', label: 'Bemcentinib (AXL Kinase Inhibitor)', desc: 'Prevents Gas6-mediated immune evasion and EMT-driven metastasis.' },
                { id: 'atezo_bev', label: 'Atezolizumab + Bevacizumab (PD-L1 + VEGF)', desc: 'Normalizes sinusoidal endothelium and promotes Kupffer/CD8+ infiltration.' }
              ].map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => setActiveDrug(tx.id as any)}
                  className={`w-full p-3 rounded-xl text-left border text-xs transition-all ${
                    activeDrug === tx.id
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold font-mono text-xs flex justify-between items-center">
                    <span>{tx.label}</span>
                    {activeDrug === tx.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
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
