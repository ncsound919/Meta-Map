import React, { useState, useEffect } from 'react';
import { Slider } from '../../ui/Slider';

import {
  Activity,
  Heart,
  Cpu,
  Layers,
  Zap,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Shield,
  Radio,
  BarChart3,
  TrendingUp,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  GitBranch,
  Wind,
  Gauge
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

export const Windkessel0DViewer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [heartRateBpm, setHeartRateBpm] = useState<number>(75);
  const [strokeVolumeMl, setStrokeVolumeMl] = useState<number>(70);
  const [arterialComplianceC, setArterialComplianceC] = useState<number>(1.2); // mL/mmHg
  const [systemicVascularResR, setSystemicVascularResR] = useState<number>(1.0); // mmHg.s/mL
  const [aorticAorticInductanceL, setAorticAorticInductanceL] = useState<number>(0.005); // mmHg.s^2/mL (4-element)
  const [aorticCharacteristicZ0, setAorticCharacteristicZ0] = useState<number>(0.05); // mmHg.s/mL (3-element)
  const [windkesselModelType, setWindkesselModelType] = useState<'2_element' | '3_element' | '4_element'>('3_element');
  const [simulationTime, setSimulationTime] = useState<number>(0);

  // Computed hemodynamics
  const cardiacOutputLpm = ((heartRateBpm * strokeVolumeMl) / 1000).toFixed(2);
  const meanArterialPressureMmHg = (Number(cardiacOutputLpm) * Number(systemicVascularResR) * 80).toFixed(0);
  const pulsePressureMmHg = (strokeVolumeMl / arterialComplianceC).toFixed(0);
  const systolicPressure = (Number(meanArterialPressureMmHg) + (2 / 3) * Number(pulsePressureMmHg)).toFixed(0);
  const diastolicPressure = (Number(meanArterialPressureMmHg) - (1 / 3) * Number(pulsePressureMmHg)).toFixed(0);

  // Generate 1 full cardiac cycle PV waveform (t = 0 to T seconds)
  const cyclePeriodSec = 60 / heartRateBpm;
  const waveformData = React.useMemo(() => {
    const pts = [];
    const steps = 40;
    const ejectionTime = cyclePeriodSec * 0.35; // Systole ~35% of cardiac cycle

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * cyclePeriodSec;
      let qIn = 0;
      if (t < ejectionTime) {
        // Half-sine ejection wave
        qIn = (strokeVolumeMl / ejectionTime) * Math.PI * 0.5 * Math.sin((Math.PI * t) / ejectionTime);
      }

      // Pressure wave calculation depending on model
      let pressure = 0;
      if (t < ejectionTime) {
        // Systolic rise
        const normT = t / ejectionTime;
        const pPeak = Number(systolicPressure);
        const pDia = Number(diastolicPressure);
        pressure = pDia + (pPeak - pDia) * Math.sin(normT * Math.PI);
        if (windkesselModelType === '3_element' || windkesselModelType === '4_element') {
          pressure += qIn * aorticCharacteristicZ0 * 2;
        }
      } else {
        // Diastolic exponential decay: P(t) = P_es * exp(-t / (R*C))
        const tDiastole = t - ejectionTime;
        const pEndSystole = Number(meanArterialPressureMmHg) + 10;
        const pDia = Number(diastolicPressure);
        const tau = systemicVascularResR * arterialComplianceC;
        pressure = pDia + (pEndSystole - pDia) * Math.exp(-tDiastole / tau);
      }

      pts.push({
        timeMs: Math.round(t * 1000),
        aorticPressure: Math.round(pressure),
        inflowRate: Math.round(qIn),
        meanPressure: Number(meanArterialPressureMmHg)
      });
    }
    return pts;
  }, [
    cyclePeriodSec,
    strokeVolumeMl,
    systolicPressure,
    diastolicPressure,
    meanArterialPressureMmHg,
    systemicVascularResR,
    arterialComplianceC,
    windkesselModelType,
    aorticCharacteristicZ0
  ]);

  // Pressure-Volume (PV) Loop Data
  const pvLoopData = React.useMemo(() => {
    const pts = [];
    const esv = 50; // End-systolic volume (mL)
    const edv = esv + strokeVolumeMl; // End-diastolic volume
    const pDia = Number(diastolicPressure);
    const pSys = Number(systolicPressure);

    // Phase 1: Isovolumetric Contraction (ESV -> EDV at Pdia, then P rises to Pdia)
    pts.push({ volume: edv, pressure: 10, label: 'End-Diastolic (Mitral Closes)' });
    pts.push({ volume: edv, pressure: pDia, label: 'Aortic Valve Opens' });
    // Phase 2: Ejection (EDV -> ESV, pressure peaks at Psys)
    pts.push({ volume: (edv + esv) / 2 + 10, pressure: pSys, label: 'Peak Systole' });
    pts.push({ volume: esv, pressure: pSys * 0.9, label: 'End-Systole (Aortic Closes)' });
    // Phase 3: Isovolumetric Relaxation (ESV, pressure drops to baseline)
    pts.push({ volume: esv, pressure: 8, label: 'Mitral Valve Opens' });
    // Phase 4: Diastolic Filling (ESV -> EDV)
    pts.push({ volume: (edv + esv) / 2, pressure: 9, label: 'Diastolic Filling' });
    pts.push({ volume: edv, pressure: 10, label: 'Cycle Complete' });

    return pts;
  }, [strokeVolumeMl, diastolicPressure, systolicPressure]);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-white">0D Lumped-Parameter Windkessel Electrical-Fluid Analog</h3>
              <p className="text-xs text-slate-400">
                Maps hydraulic variables (Pressure $\leftrightarrow$ Voltage, Flow $\leftrightarrow$ Current, Compliance $\leftrightarrow$ Capacitance, SVR $\leftrightarrow$ Resistance)
              </p>
            </div>
          </div>

          {/* Model Type Selector */}
          <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {[
              { id: '2_element', label: '2-Element (R-C)' },
              { id: '3_element', label: '3-Element (R-C-Z0)' },
              { id: '4_element', label: '4-Element (R-C-Z0-L)' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setWindkesselModelType(m.id as any)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  windkesselModelType === m.id
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Windkessel Hemodynamic Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">CARDIAC OUTPUT (CO)</span>
            <strong className="text-lg font-bold font-mono text-amber-400">{cardiacOutputLpm} L/min</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">BLOOD PRESSURE (BP)</span>
            <strong className="text-lg font-bold font-mono text-emerald-400">{systolicPressure}/{diastolicPressure} mmHg</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">MAP (MEAN PRESSURE)</span>
            <strong className="text-lg font-bold font-mono text-cyan-400">{meanArterialPressureMmHg} mmHg</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">PULSE PRESSURE (ΔP)</span>
            <strong className="text-lg font-bold font-mono text-purple-400">{pulsePressureMmHg} mmHg</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">RC TIME CONSTANT (τ)</span>
            <strong className="text-lg font-bold font-mono text-rose-400">{(systemicVascularResR * arterialComplianceC).toFixed(2)} s</strong>
          </div>
        </div>
      </div>

      {/* Waveform & PV Loop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pulsatile Pressure & Flow Waveforms */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-sm text-white">Aortic Pressure Waveform & Ventricular Ejection Flow</h4>
              </div>
              <span className="text-xs font-mono text-slate-400">1 Cardiac Cycle ({Math.round(cyclePeriodSec * 1000)} ms)</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waveformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timeMs" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Time (ms)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Pressure (mmHg)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="aorticPressure" name="Aortic Pressure (mmHg)" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="inflowRate" name="Aortic Inflow Q(t) (mL/s)" stroke="#38bdf8" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                  <Line type="monotone" dataKey="meanPressure" name="MAP Target" stroke="#64748b" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PV Loop Chart */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-sm text-white">Left Ventricular Pressure-Volume (PV) Loop</h4>
              </div>
              <span className="text-xs font-mono text-cyan-400">Stroke Work ~ {((Number(meanArterialPressureMmHg) * strokeVolumeMl * 0.0133)).toFixed(1)} J</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pvLoopData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="volume" domain={[40, 140]} stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Ventricular Volume (mL)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" domain={[0, 140]} tick={{ fontSize: 10 }} label={{ value: 'LV Pressure (mmHg)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Line type="linear" dataKey="pressure" name="PV Loop Curve" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Parameters & Circuit Tuning */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-sm text-white">Circuit & Pump Parameters</h4>
            </div>

            {/* Heart Rate */}
            <Slider
  label="Heart Rate (HR):"
  min={40}
  max={160}
  step={5}
  value={heartRateBpm}
  onChange={setHeartRateBpm}
  valueDisplay={<>{heartRateBpm} BPM</>}
/>

            {/* Stroke Volume */}
            <Slider
  label="Stroke Volume (SV):"
  min={30}
  max={120}
  step={5}
  value={strokeVolumeMl}
  onChange={setStrokeVolumeMl}
  valueDisplay={<>{strokeVolumeMl} mL</>}
/>

            {/* Total Arterial Compliance */}
            <Slider
  label="Arterial Compliance (C):"
  min={0.4}
  max={2.5}
  step={0.1}
  value={arterialComplianceC}
  onChange={setArterialComplianceC}
  valueDisplay={<>{arterialComplianceC.toFixed(2)} mL/mmHg</>}
/>

            {/* Systemic Vascular Resistance */}
            <Slider
  label="Systemic Resistance (R / SVR):"
  min={0.5}
  max={2.5}
  step={0.05}
  value={systemicVascularResR}
  onChange={setSystemicVascularResR}
  valueDisplay={<>{systemicVascularResR.toFixed(2)} mmHg·s/mL</>}
/>

            {/* Characteristic Impedance (3-element) */}
            {(windkesselModelType === '3_element' || windkesselModelType === '4_element') && (
              <Slider
  label="Aortic Characteristic Z0:"
  min={0.01}
  max={0.15}
  step={0.005}
  value={aorticCharacteristicZ0}
  onChange={setAorticCharacteristicZ0}
  valueDisplay={<>{aorticCharacteristicZ0.toFixed(3)} mmHg·s/mL</>}
/>
            )}
          </div>

          {/* Model Mathematical Circuit Topology Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-xs text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" /> Circuit Equations
            </h4>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
              <div><strong>ODE:</strong> $I(t) = C \frac&#123;dP&#125;&#123;dt&#125; + \frac&#123;P(t) - P_&#123;\text&#123;venous&#125;&#125;&#125;&#123;R&#125;$</div>
              <div><strong>Windkessel 3:</strong> $P(t) = P_C(t) + Z_0 \cdot Q(t)$</div>
              <div><strong>Time Constant:</strong> $\tau = R \cdot C = {(systemicVascularResR * arterialComplianceC).toFixed(2)}\,\text&#123;s&#125;$</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
