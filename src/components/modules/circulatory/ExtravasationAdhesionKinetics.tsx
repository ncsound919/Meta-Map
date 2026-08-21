import React, { useState, useMemo } from 'react';
import {
  Zap,
  Activity,
  Layers,
  Shield,
  ShieldAlert,
  Sparkles,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  TrendingDown,
  TrendingUp,
  Info,
  Clock,
  Dna
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

export const ExtravasationAdhesionKinetics: React.FC = () => {
  // Biomechanical Parameters
  const [wallShearStressDyn, setWallShearStressDyn] = useState<number>(2.5); // dyn/cm2 (0.5 to 15)
  const [eSelectinDensity, setESelectinDensity] = useState<number>(80); // % expression
  const [integrinAffinityState, setIntegrinAffinityState] = useState<'low' | 'intermediate' | 'high_active'>('high_active');
  const [veCadherinIntegrity, setVeCadherinIntegrity] = useState<number>(35); // 0-100% (lower = looser junctions)
  const [mmpSecretionLevel, setMmpSecretionLevel] = useState<number>(70); // % MMP-2/9 activity
  const [chemokineGradientCxcl12, setChemokineGradientCxcl12] = useState<number>(85); // %

  // Pharmacological Interventions
  const [activeIntervention, setActiveIntervention] = useState<'none' | 'uproleselan' | 'natalizumab' | 've_cadherin_stabilizer' | 'mmp_inhibitor'>('none');

  // Adhesion Cascade Kinetics Calculations (Bell's Catch-Slip Bond Model)
  const kinetics = useMemo(() => {
    let effectiveSelectin = eSelectinDensity;
    let effectiveIntegrin = integrinAffinityState === 'high_active' ? 95 : integrinAffinityState === 'intermediate' ? 50 : 15;
    let effectiveJunctions = veCadherinIntegrity;
    let effectiveMmp = mmpSecretionLevel;

    // Apply Pharmacological Inhibitors
    if (activeIntervention === 'uproleselan') {
      effectiveSelectin = Math.round(effectiveSelectin * 0.12); // E-selectin antagonist
    } else if (activeIntervention === 'natalizumab') {
      effectiveIntegrin = Math.round(effectiveIntegrin * 0.15); // Anti-α4β1 integrin mAb
    } else if (activeIntervention === 've_cadherin_stabilizer') {
      effectiveJunctions = Math.min(100, effectiveJunctions + 50); // Seals junctions
    } else if (activeIntervention === 'mmp_inhibitor') {
      effectiveMmp = Math.round(effectiveMmp * 0.2); // Broad-spectrum MMP-i
    }

    // 1. Hydrodynamic Detachment Force F = 6 * pi * mu * R * v_shear * tau
    const hydrodynamicDragForcePn = wallShearStressDyn * 18.5; // pN (picoNewtons)

    // 2. Rolling Velocity (µm/s) governed by Selectin bond dissociation
    const rollingVelocityUms = (wallShearStressDyn * 8.0) / Math.max(0.1, effectiveSelectin / 40);

    // 3. Firm Arrest Probability (%)
    // Bell's model: Catch bond reinforces under moderate shear (1-3 dyn), slips at high shear (>8 dyn)
    const shearCatchFactor = wallShearStressDyn <= 3.5 ? 1.0 + (wallShearStressDyn * 0.2) : Math.exp(-0.35 * (wallShearStressDyn - 3.5));
    const firmArrestProb = Math.min(98, Math.max(1, Math.round((effectiveIntegrin * 0.85 + effectiveSelectin * 0.2) * shearCatchFactor)));

    // 4. Transendothelial Migration (TEM) Rate (% successful diapedesis in 6 hours)
    const junctionPermeability = (100 - effectiveJunctions) / 100;
    const mmpDigestScore = effectiveMmp / 100;
    const chemoAttraction = chemokineGradientCxcl12 / 100;
    const temSuccessRate = Math.min(95, Math.max(2, Math.round(firmArrestProb * (0.35 * junctionPermeability + 0.35 * mmpDigestScore + 0.3 * chemoAttraction))));

    // 5. Mean Diapedesis Duration (minutes)
    const diapedesisTimeMin = Math.round(180 / Math.max(0.2, junctionPermeability * 0.6 + mmpDigestScore * 0.8));

    return {
      hydrodynamicDragForcePn: hydrodynamicDragForcePn.toFixed(1),
      rollingVelocityUms: rollingVelocityUms.toFixed(1),
      firmArrestProb,
      temSuccessRate,
      diapedesisTimeMin,
      effectiveSelectin,
      effectiveIntegrin,
      effectiveJunctions,
      effectiveMmp
    };
  }, [
    wallShearStressDyn,
    eSelectinDensity,
    integrinAffinityState,
    veCadherinIntegrity,
    mmpSecretionLevel,
    chemokineGradientCxcl12,
    activeIntervention
  ]);

  // Transmigration Curve over 6 hours (0 to 360 min)
  const temTimeCourseData = useMemo(() => {
    const data = [];
    const maxPct = kinetics.temSuccessRate;
    const kRate = 0.015 * (100 / Math.max(30, kinetics.diapedesisTimeMin));

    for (let t = 0; t <= 360; t += 30) {
      // Sigmoidal / asymptotic transmigration
      const completedTem = Math.round(maxPct * (1 - Math.exp(-kRate * t)));
      const arrestedOnSurface = Math.max(0, Math.round(kinetics.firmArrestProb * Math.exp(-kRate * t * 0.6) - completedTem * 0.2));
      const shearedAway = Math.max(0, 100 - completedTem - arrestedOnSurface);

      data.push({
        timeMin: `${t}m`,
        transmigrated: completedTem,
        arrestedLumen: arrestedOnSurface,
        shearedDetached: shearedAway
      });
    }
    return data;
  }, [kinetics]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Endothelial Rolling, Firm Adhesion & Transendothelial Migration (TEM) Kinetics
              </h3>
              <p className="text-xs text-slate-400">
                Multi-stage biophysical model of the metastatic cascade: Selectin tethering, Integrin catch-bonds, VE-cadherin junction opening, and MMP basement membrane cleavage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-3 py-1 rounded-full font-bold bg-amber-950 text-amber-300 border border-amber-800">
              TEM DIAPEDESIS RATE: {kinetics.temSuccessRate}%
            </span>
          </div>
        </div>

        {/* 4-Stage Metastatic Extravasation Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span>1. Selectin Tethering</span>
              <span className="text-[10px] text-slate-500">t = 0–30s</span>
            </div>
            <p className="text-[11px] text-slate-300">
              E/P-Selectin binds sLeX ligands; hydrodynamic drag creates transient catch-slip rolling at {kinetics.rollingVelocityUms} µm/s.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-purple-400 font-bold">
              <span>2. Integrin Firm Arrest</span>
              <span className="text-[10px] text-slate-500">t = 1–5m</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Inside-out chemokine activation locks α4β1/αvβ3 into high-affinity state binding VCAM-1 ({kinetics.firmArrestProb}% arrest).
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-amber-400 font-bold">
              <span>3. Junction Disruption</span>
              <span className="text-[10px] text-slate-500">t = 10–60m</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Tumor-derived VEGF & histamine phosphorylate VE-cadherin, disassembling adherens junctions to open paracellular pores.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>4. Matrix Diapedesis</span>
              <span className="text-[10px] text-slate-500">t = 1–6h</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Invadopodia secrete MMP-2/9, cleaving Type-IV collagen in the basement membrane for parenchymal invasion ({kinetics.diapedesisTimeMin}m avg).
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Mechanical & Molecular Controls */}
        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" /> Molecular & Hydrodynamic Tuning
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Bell's Kinetics</span>
          </div>

          <div className="space-y-3.5">
            {/* Wall Shear Stress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Vessel Wall Shear Stress (τ):</span>
                <span className="text-amber-400 font-bold">{wallShearStressDyn} dyn/cm²</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.25"
                value={wallShearStressDyn}
                onChange={(e) => setWallShearStressDyn(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Venule (1–4 dyn)</span>
                <span>Capillary (5–10 dyn)</span>
                <span>Arteriole (15+ dyn)</span>
              </div>
            </div>

            {/* E-Selectin Endothelial Density */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Endothelial E-Selectin Density:</span>
                <span className="text-cyan-400 font-bold">{eSelectinDensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={eSelectinDensity}
                onChange={(e) => setESelectinDensity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Integrin Affinity State */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Integrin Affinity State (α4β1 / αvβ3):</span>
                <span className="text-purple-400 font-bold uppercase">{integrinAffinityState.replace('_', ' ')}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['low', 'intermediate', 'high_active'] as const).map((state) => (
                  <button
                    key={state}
                    onClick={() => setIntegrinAffinityState(state)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      integrinAffinityState === state
                        ? 'bg-purple-950 border border-purple-500 text-purple-200'
                        : 'bg-slate-950 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {state.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* VE-Cadherin Junction Integrity */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">VE-Cadherin Junction Integrity (Barrier Tightness):</span>
                <span className="text-emerald-400 font-bold">{veCadherinIntegrity}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={veCadherinIntegrity}
                onChange={(e) => setVeCadherinIntegrity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Leaky / Disassembled</span>
                <span>Intact Blood-Tissue Barrier</span>
              </div>
            </div>

            {/* MMP Activity */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">MMP-2 / MMP-9 Secretion Level:</span>
                <span className="text-rose-400 font-bold">{mmpSecretionLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={mmpSecretionLevel}
                onChange={(e) => setMmpSecretionLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
            </div>
          </div>

          {/* Pharmacological Interventions Sandbox */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Apply Anti-Extravasation Therapy:</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'none', label: 'None (Control)' },
                { id: 'uproleselan', label: 'Uproleselan (E-Selectin-i)' },
                { id: 'natalizumab', label: 'Natalizumab (Anti-α4β1)' },
                { id: 've_cadherin_stabilizer', label: 'Angiopoietin-1 (Tie2)' },
                { id: 'mmp_inhibitor', label: 'Marimastat (MMP-i)' }
              ].map((drug) => (
                <button
                  key={drug.id}
                  onClick={() => setActiveIntervention(drug.id as any)}
                  className={`p-2 rounded-xl border text-xs font-mono transition-all text-left ${
                    activeIntervention === drug.id
                      ? 'bg-amber-950/70 border-amber-500 text-amber-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {drug.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Time-Series Diapedesis Plot & Extravasation Metrics */}
        <div className="xl:col-span-7 space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">HYDRODYNAMIC DRAG</span>
              <div className="text-xl font-bold font-mono text-amber-400">{kinetics.hydrodynamicDragForcePn} pN</div>
              <span className="text-[9px] text-slate-500 font-mono">Detachment Force</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">FIRM ARREST RATE</span>
              <div className="text-xl font-bold font-mono text-purple-400">{kinetics.firmArrestProb}%</div>
              <span className="text-[9px] text-slate-500 font-mono">Integrin Catch-Bonds</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">6-HR DIAPEDESIS</span>
              <div className="text-xl font-bold font-mono text-emerald-400">{kinetics.temSuccessRate}%</div>
              <span className="text-[9px] text-slate-500 font-mono">Parenchymal Entry</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">TRANSIT DURATION</span>
              <div className="text-xl font-bold font-mono text-cyan-400">{kinetics.diapedesisTimeMin} min</div>
              <span className="text-[9px] text-slate-500 font-mono">Mean TEM Time</span>
            </div>
          </div>

          {/* 6-Hour Transendothelial Extravasation Area Chart */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                  6-Hour Cellular Fate Progression (Lumen vs. Paracellular Diapedesis)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Bell's Adhesion Rate ODE</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={temTimeCourseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timeMin" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
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
                    dataKey="transmigrated"
                    name="Successfully Transmigrated into Stroma (%)"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="arrestedLumen"
                    name="Arrested on Endothelial Lumen (%)"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="shearedDetached"
                    name="Detached / Swept Away by Flow (%)"
                    stackId="1"
                    stroke="#64748b"
                    fill="#64748b"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
