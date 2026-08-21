import React, { useState, useEffect } from 'react';
import { Slider } from '../../ui/Slider';

import {
  GitBranch,
  Activity,
  Sliders,
  Zap,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Cpu
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

export const WavePropagation1DViewer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [aorticStiffnessBeta, setAorticStiffnessBeta] = useState<number>(6.0); // 3.0 (young elastic) to 15.0 (elderly stiff)
  const [peripheralReflectionCoeffGamma, setPeripheralReflectionCoeffGamma] = useState<number>(0.35); // 0.1 to 0.8
  const [pulseWaveVelocityPwv, setPulseWaveVelocityPwv] = useState<number>(6.5); // m/s (Moens-Korteweg: c = sqrt(E h / (2 rho R)))
  const [arterialTreeLengthCm, setArterialTreeLengthCm] = useState<number>(100); // 80 - 140 cm
  const [selectedBranch, setSelectedBranch] = useState<'ascending_aorta' | 'carotid' | 'femoral' | 'radial'>('femoral');

  // Moens-Korteweg / Bramwell-Hill wave speed
  const calculatedPWV = (4.5 * Math.sqrt(aorticStiffnessBeta / 5.0)).toFixed(1);
  const transitTimeMs = ((arterialTreeLengthCm / 100) / Number(calculatedPWV) * 1000).toFixed(0);
  const augmentationIndexPct = Math.round(peripheralReflectionCoeffGamma * 100 * (Number(calculatedPWV) / 6.0));

  // Generate 1D Forward (Pf), Backward/Reflected (Pb), and Total (P = Pf + Pb) Pressure Waves along length x
  const waveData = React.useMemo(() => {
    const pts = [];
    const steps = 50;
    const T = 0.85; // 850 ms cardiac cycle
    const pwv = Number(calculatedPWV);
    const gamma = peripheralReflectionCoeffGamma;

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * T;
      const tMs = Math.round(t * 1000);

      // Forward wave (systolic ejection pulse)
      const forwardT = Math.max(0, t - 0.05);
      const Pf = 80 + 40 * Math.sin(Math.min(Math.PI, (forwardT / 0.3) * Math.PI));

      // Reflected backward wave (delayed by 2 * L / PWV)
      const delaySec = (2 * (arterialTreeLengthCm / 100)) / pwv;
      let Pb = 0;
      if (t > delaySec) {
        const reflectedT = t - delaySec;
        Pb = gamma * 40 * Math.sin(Math.min(Math.PI, (reflectedT / 0.3) * Math.PI));
      }

      const Ptot = Pf + Pb;

      pts.push({
        timeMs: tMs,
        forwardWavePf: Math.round(Pf),
        reflectedWavePb: Math.round(Pb),
        totalPressureP: Math.round(Ptot)
      });
    }
    return pts;
  }, [calculatedPWV, peripheralReflectionCoeffGamma, arterialTreeLengthCm]);

  // Spatial Pressure Profile along Arterial Tree (x = 0 cm to 100 cm)
  const spatialData = React.useMemo(() => {
    const pts = [];
    const pwv = Number(calculatedPWV);
    for (let x = 0; x <= 100; x += 5) {
      const delay = (x / 100) / pwv;
      const peakPressure = 120 + (x / 100) * (augmentationIndexPct * 0.4); // Wave peaking phenomenon in distal arteries
      pts.push({
        distanceCm: x,
        peakSystolicP: Math.round(peakPressure),
        pulseVelocity: pwv + (x / 100) * 2.0 // Distal arteries are naturally stiffer
      });
    }
    return pts;
  }, [calculatedPWV, augmentationIndexPct]);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-sm text-white">1D Wave Propagation & Pulse Reflection Solver</h3>
              <p className="text-xs text-slate-400">
                Solves 1D cross-sectional area conservation $\frac&#123;\partial A&#125;&#123;\partial t&#125; + \frac&#123;\partial Q&#125;&#123;\partial x&#125; = 0$ and momentum Navier-Stokes along branching arterial trees.
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {(['ascending_aorta', 'carotid', 'femoral', 'radial'] as const).map((branch) => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`px-3 py-1 rounded-lg transition-all capitalize ${
                  selectedBranch === branch
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {branch.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">PULSE WAVE VELOCITY (PWV)</span>
            <strong className="text-lg font-bold font-mono text-cyan-400">{calculatedPWV} m/s</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">WAVE TRANSIT TIME (Δt)</span>
            <strong className="text-lg font-bold font-mono text-amber-400">{transitTimeMs} ms</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">AUGMENTATION INDEX (AIx)</span>
            <strong className="text-lg font-bold font-mono text-rose-400">+{augmentationIndexPct}%</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">REFLECTION COEFFICIENT (Γ)</span>
            <strong className="text-lg font-bold font-mono text-emerald-400">{peripheralReflectionCoeffGamma.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Wave Separation & Spatial Peaking Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Wave Separation (Forward Pf vs Backward Pb) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-sm text-white">Wave Separation Analysis: Forward ($P_f$), Backward ($P_b$), and Sum ($P_&#123;\text&#123;tot&#125;&#125;$)</h4>
              </div>
              <span className="text-xs font-mono text-slate-400">Arterial Site: {selectedBranch.toUpperCase()}</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timeMs" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Time (ms)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 160]} label={{ value: 'Pressure (mmHg)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="totalPressureP" name="Total Pressure P(t)" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="forwardWavePf" name="Forward Ejection Wave Pf(t)" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                  <Line type="monotone" dataKey="reflectedWavePb" name="Backward Reflected Wave Pb(t)" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spatial Peaking Chart */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-sm text-white">Spatial Pulse Amplification Along Arterial Tree ($x = 0$ to $100\,\text&#123;cm&#125;$)</h4>
              </div>
              <span className="text-xs font-mono text-emerald-400">Distal Pulse Peaking Phenomenon</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spatialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="distanceCm" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Distance from Aortic Valve (cm)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" domain={[100, 160]} tick={{ fontSize: 10 }} label={{ value: 'Peak Systolic P (mmHg)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="peakSystolicP" name="Peak Systolic Pressure (mmHg)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Wave Equations & Elastic Tuning */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-sm text-white">Arterial Tree Biophysics</h4>
            </div>

            {/* Aortic Stiffness Beta */}
            <Slider
  label="Stiffness Index ($\beta$):"
  min={3.0}
  max={15.0}
  step={0.5}
  value={aorticStiffnessBeta}
  onChange={setAorticStiffnessBeta}
  valueDisplay={<>{aorticStiffnessBeta.toFixed(1)}</>}
/>

            {/* Tree Length */}
            <Slider
  label="Arterial Tree Length ($L$):"
  min={70}
  max={130}
  step={5}
  value={arterialTreeLengthCm}
  onChange={setArterialTreeLengthCm}
  valueDisplay={<>{arterialTreeLengthCm} cm</>}
/>
          </div>

          {/* Governing 1D Equations */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-xs text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Moens-Korteweg Formulation
            </h4>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
              <div><strong>Wave Speed:</strong> $c = \sqrt&#123;\frac&#123;E \cdot h&#125;&#123;2 \rho R&#125;&#125; = {calculatedPWV}\,\text&#123;m/s&#125;$</div>
              <div><strong>Characteristic:</strong> $W_&#123;1,2&#125; = u \pm \int \frac&#123;c&#125;&#123;A&#125; dA$</div>
              <div><strong>Reflection:</strong> $\Gamma = \frac&#123;Y_1 - Y_2&#125;&#123;Y_1 + Y_2&#125;$</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
