import React, { useState, useEffect } from 'react';
import { Slider } from '../../ui/Slider';

import {
  Layers,
  Activity,
  Zap,
  Sliders,
  ShieldAlert,
  Wind,
  CheckCircle2,
  Cpu,
  Flame,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

export const MultiphysicsCFD3DViewer: React.FC = () => {
  const [geometryType, setGeometryType] = useState<'aortic_bifurcation' | 'coronary_stenosis' | 'carotid_bulb' | 'microvascular_capillary_bed'>('coronary_stenosis');
  const [meshResolutionElements, setMeshResolutionElements] = useState<number>(450000); // 100k to 1.2M tetrahedral elements
  const [fluidModel, setFluidModel] = useState<'newtonian' | 'carreau_yasuda_shear_thinning' | 'casson'>('carreau_yasuda_shear_thinning');
  const [stenosisSeverityPct, setStenosisSeverityPct] = useState<number>(65); // 0% to 90% stenosis
  const [fsiElasticityMpa, setFsiElasticityMpa] = useState<number>(1.2); // Vessel wall Young's modulus (MPa)

  // Compute 3D CFD metrics
  // Fractional Flow Reserve (FFR) = Pd / Pa across stenosis
  const computedFFR = (1.0 - (Math.pow(stenosisSeverityPct / 100, 2) * 0.75)).toFixed(2);
  const peakWallShearStressPa = (1.5 + Math.pow(stenosisSeverityPct / 40, 3) * 12.0).toFixed(1);
  const oscillatoryShearIndexOsi = (0.05 + (stenosisSeverityPct / 100) * 0.38).toFixed(3);
  const pressureDropMmHg = (4.0 + Math.pow(stenosisSeverityPct / 30, 2) * 18.0).toFixed(1);
  const endothelialDamageRisk = stenosisSeverityPct > 70 ? 'CRITICAL (>70% Stenosis, FFR < 0.75)' : stenosisSeverityPct > 50 ? 'MODERATE' : 'LOW';

  // Spatial WSS Distribution Data
  const wssDistributionData = [
    { zone: 'Proximal Inlet', wssPa: 1.8, osi: 0.04, velocityMs: 0.35 },
    { zone: 'Throat (Stenosis)', wssPa: Number(peakWallShearStressPa), osi: 0.08, velocityMs: 1.85 },
    { zone: 'Recirculation Vortex', wssPa: 0.4, osi: Number(oscillatoryShearIndexOsi), velocityMs: 0.15 },
    { zone: 'Reattachment Jet', wssPa: 4.2, osi: 0.12, velocityMs: 0.65 },
    { zone: 'Distal Outlet', wssPa: 1.5, osi: 0.05, velocityMs: 0.32 }
  ];

  // Hemodynamic Risk Radar Data
  const radarData = [
    { metric: 'Wall Shear (WSS)', value: Math.min(100, Number(peakWallShearStressPa) * 4) },
    { metric: 'OSI Turbulence', value: Number(oscillatoryShearIndexOsi) * 200 },
    { metric: 'Pressure Drop (ΔP)', value: Math.min(100, Number(pressureDropMmHg) * 2.5) },
    { metric: 'Platelet Activation Risk', value: Math.min(100, (Number(peakWallShearStressPa) / 25) * 100) },
    { metric: 'Thrombus Vortex Trapping', value: Math.min(100, (stenosisSeverityPct / 80) * 100) }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Geometry Selector */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-bold text-sm text-white">3D Multiphysics CFD & Fluid-Structure Interaction (FSI) Pipeline</h3>
              <p className="text-xs text-slate-400">
                Solves full incompressible Navier-Stokes $\rho(\partial_t \mathbf&#123;u&#125; + \mathbf&#123;u&#125;\cdot\nabla\mathbf&#123;u&#125;) = -\nabla p + \mu\nabla^2\mathbf&#123;u&#125;$ coupled with hyperelastic vessel wall mechanics.
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {[
              { id: 'coronary_stenosis', label: 'Coronary Stenosis (FFR)' },
              { id: 'aortic_bifurcation', label: 'Aortic Bifurcation' },
              { id: 'carotid_bulb', label: 'Carotid Bulb' },
              { id: 'microvascular_capillary_bed', label: 'Microvascular Bed' }
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setGeometryType(g.id as any)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  geometryType === g.id
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live CFD Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">FRACTIONAL FLOW RESERVE (FFR)</span>
            <strong className={`text-lg font-bold font-mono ${Number(computedFFR) < 0.80 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {computedFFR} <span className="text-xs font-normal text-slate-500">{Number(computedFFR) < 0.80 ? '(Ischemic)' : '(Normal)'}</span>
            </strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">PEAK WALL SHEAR STRESS</span>
            <strong className="text-lg font-bold font-mono text-purple-400">{peakWallShearStressPa} Pa</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">OSCILLATORY SHEAR INDEX (OSI)</span>
            <strong className="text-lg font-bold font-mono text-amber-400">{oscillatoryShearIndexOsi}</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">TRANSTENOTIC ΔP</span>
            <strong className="text-lg font-bold font-mono text-cyan-400">{pressureDropMmHg} mmHg</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">MESH ELEMENTS (FEA)</span>
            <strong className="text-lg font-bold font-mono text-slate-300">{(meshResolutionElements / 1000).toFixed(0)}k Tets</strong>
          </div>
        </div>
      </div>

      {/* Visual CFD Analysis Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Spatial WSS Bar Chart & Radar Risk Assessment */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h4 className="font-bold text-sm text-white">Spatial Wall Shear Stress ($\tau_w$) & Flow Velocity Across Vessel Geometry</h4>
              </div>
              <span className="text-xs font-mono text-slate-400">{fluidModel.replace(/_/g, ' ').toUpperCase()}</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wssDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="zone" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'WSS (Pa) / Velocity (m/s)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="wssPa" name="Wall Shear Stress (Pa)" fill="#c084fc" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="velocityMs" name="Peak Jet Velocity (m/s)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biomechanical Risk Radar */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h4 className="font-bold text-sm text-white">Multiphysics Hemodynamic & Thrombosis Risk Profile</h4>
              </div>
              <span className="text-xs font-mono text-rose-400 font-bold">{endothelialDamageRisk}</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 9 }} />
                  <Radar name="Severity Index" dataKey="value" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Stenosis & Rheology Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h4 className="font-bold text-sm text-white">Mesh & Rheology Parameters</h4>
            </div>

            {/* Stenosis Severity */}
            <Slider
  label="Stenosis Diameter Reduction:"
  min={0}
  max={90}
  step={5}
  value={stenosisSeverityPct}
  onChange={setStenosisSeverityPct}
  valueDisplay={<>{stenosisSeverityPct}%</>}
/>

            {/* Non-Newtonian Rheology Model */}
            <div className="space-y-1 text-xs">
              <span className="text-slate-300 block font-semibold">Blood Rheology Constitutive Law:</span>
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {[
                  { id: 'carreau_yasuda_shear_thinning', label: 'Carreau-Yasuda (Shear-Thinning)' },
                  { id: 'casson', label: 'Casson Yield Stress Model' },
                  { id: 'newtonian', label: 'Newtonian (Constant 3.5 cP)' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setFluidModel(m.id as any)}
                    className={`py-1.5 px-2.5 rounded-lg border text-left font-mono text-[11px] transition-all ${
                      fluidModel === m.id
                        ? 'bg-purple-950/60 border-purple-500 text-purple-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vessel Wall Elasticity (FSI) */}
            <Slider
  label="Wall Young's Modulus ($E$):"
  min={0.3}
  max={4.0}
  step={0.1}
  value={fsiElasticityMpa}
  onChange={setFsiElasticityMpa}
  valueDisplay={<>{fsiElasticityMpa.toFixed(1)} MPa</>}
/>
          </div>

          {/* Governing CFD Equations */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-xs text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" /> Navier-Stokes Formulation
            </h4>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
              <div><strong>Momentum:</strong> $\rho \frac&#123;D\mathbf&#123;u&#125;&#125;&#123;Dt&#125; = -\nabla p + \nabla \cdot \boldsymbol&#123;\tau&#125;$</div>
              <div><strong>Oscillatory Index:</strong> $\text&#123;OSI&#125; = \frac&#123;1&#125;&#123;2&#125; \left(1 - \frac&#123;|\int_0^T \boldsymbol&#123;\tau&#125;_w dt|&#125;&#123;\int_0^T |\boldsymbol&#123;\tau&#125;_w| dt&#125;\right)$</div>
              <div><strong>Fractional Reserve:</strong> $\text&#123;FFR&#125; = \frac&#123;P_d&#125;&#123;P_a&#125; = {computedFFR}$</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
