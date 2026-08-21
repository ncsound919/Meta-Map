import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Droplets,
  Heart,
  Shield,
  Zap,
  Sliders,
  Settings2,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Info,
  TrendingUp,
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
  BarChart,
  Bar
} from 'recharts';

export const BenchtopMockLoopViewer: React.FC = () => {
  const [pumpType, setPumpType] = useState<'pulsatile_pneumatic' | 'continuous_cf_lvad' | 'silicone_ventricle'>('pulsatile_pneumatic');
  const [lvadSpeedRpm, setLvadSpeedRpm] = useState<number>(9200); // 8000 - 12000 RPM
  const [complianceChamberAirMl, setComplianceChamberAirMl] = useState<number>(450); // Air buffer volume
  const [throttleValveResistanceR, setThrottleValveResistanceR] = useState<number>(1.15); // Variable peripheral throttle valve
  const [bloodAnalogFluid, setBloodAnalogFluid] = useState<'water_glycerol_40' | 'sodium_iodide_viscous' | 'saline_water'>('water_glycerol_40');
  const [valveTypeTested, setValveTypeTested] = useState<'mechanical_bileaflet' | 'bioprosthetic_tissue' | 'polymeric_leaflet'>('mechanical_bileaflet');

  // Computed benchtop telemetry
  const loopFlowRateLpm = (pumpType === 'continuous_cf_lvad' ? (lvadSpeedRpm / 9200) * 5.2 : 4.8).toFixed(2);
  const systemicPressureMmHg = Math.round(Number(loopFlowRateLpm) * throttleValveResistanceR * 22);
  const hemolysisIndexMgDl = (
    (pumpType === 'continuous_cf_lvad' ? (lvadSpeedRpm / 8000) * 8.5 : 3.2) *
    (bloodAnalogFluid === 'saline_water' ? 0.4 : 1.0)
  ).toFixed(1);
  const effectiveComplianceMlMmHg = ((complianceChamberAirMl / 100) * 0.35).toFixed(2);

  // Pressure cycle in benchtop chamber
  const benchtopCycleData = [
    { tMs: 0, ventricularP: 10, aorticP: 80, lvadFlow: 4.8 },
    { tMs: 100, ventricularP: 65, aorticP: 82, lvadFlow: 4.9 },
    { tMs: 200, ventricularP: 125, aorticP: 120, lvadFlow: 5.6 },
    { tMs: 300, ventricularP: 128, aorticP: 124, lvadFlow: 5.8 },
    { tMs: 400, ventricularP: 35, aorticP: 105, lvadFlow: 5.1 },
    { tMs: 500, ventricularP: 12, aorticP: 95, lvadFlow: 4.7 },
    { tMs: 600, ventricularP: 10, aorticP: 88, lvadFlow: 4.6 },
    { tMs: 700, ventricularP: 10, aorticP: 82, lvadFlow: 4.6 }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Physical Benchtop Mock Circulatory Loop (MCL)</h3>
              <p className="text-xs text-slate-400">
                In vitro hydrodynamic testing bench for prosthetic heart valves, Total Artificial Hearts (TAH), and Left Ventricular Assist Devices (LVAD).
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {[
              { id: 'pulsatile_pneumatic', label: 'Pulsatile Piston' },
              { id: 'continuous_cf_lvad', label: 'Continuous LVAD' },
              { id: 'silicone_ventricle', label: 'Silicone Ventricle' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPumpType(p.id as any)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  pumpType === p.id
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Benchtop Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">LOOP FLOW RATE</span>
            <strong className="text-lg font-bold font-mono text-emerald-400">{loopFlowRateLpm} L/min</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">SYSTEMIC PRESSURE</span>
            <strong className="text-lg font-bold font-mono text-cyan-400">{systemicPressureMmHg} mmHg</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">HEMOLYSIS INDEX (fHb)</span>
            <strong className={`text-lg font-bold font-mono ${Number(hemolysisIndexMgDl) > 10 ? 'text-rose-400' : 'text-amber-400'}`}>
              {hemolysisIndexMgDl} mg/dL
            </strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">CHAMBER COMPLIANCE</span>
            <strong className="text-lg font-bold font-mono text-purple-400">{effectiveComplianceMlMmHg} mL/mmHg</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block">VALVE REGURGITATION</span>
            <strong className="text-lg font-bold font-mono text-slate-300">3.8%</strong>
          </div>
        </div>
      </div>

      {/* Benchtop Hardware Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Benchtop Pressure Transducer Waveforms */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-sm text-white">Piezoelectric Pressure Transducer Waveforms</h4>
              </div>
              <span className="text-xs font-mono text-slate-400">Sample Rate: 1000 Hz</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={benchtopCycleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="tMs" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Time (ms)', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Pressure (mmHg)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="ventricularP" name="Ventricular Chamber P (mmHg)" stroke="#ec4899" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="aorticP" name="Aortic Compliance Tank P (mmHg)" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="lvadFlow" name="Rotary Flow (L/min)" stroke="#38bdf8" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Benchtop Hardware Component Schematic */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" /> Physical Mock Loop Hardware Configuration
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">1. ACTUATOR UNIT</span>
                <strong className="text-emerald-400 block mt-1">{pumpType.replace(/_/g, ' ').toUpperCase()}</strong>
                <span className="text-slate-400 text-[10px] block mt-0.5">Linear motor + bellows</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">2. COMPLIANCE TANK</span>
                <strong className="text-cyan-400 block mt-1">{complianceChamberAirMl} mL Air Volume</strong>
                <span className="text-slate-400 text-[10px] block mt-0.5">Windkessel elasticity analog</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">3. THROTTLE VALVE</span>
                <strong className="text-purple-400 block mt-1">R = {throttleValveResistanceR.toFixed(2)} PRU</strong>
                <span className="text-slate-400 text-[10px] block mt-0.5">Peripheral systemic load</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Hardware Settings */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">Benchtop Hardware Calibration</h4>
            </div>

            {/* LVAD RPM if continuous */}
            {pumpType === 'continuous_cf_lvad' && (
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Impeller Speed (RPM):</span>
                  <span className="font-mono font-bold text-cyan-400">{lvadSpeedRpm} RPM</span>
                </div>
                <input
                  type="range"
                  min="7000"
                  max="12000"
                  step="200"
                  value={lvadSpeedRpm}
                  onChange={(e) => setLvadSpeedRpm(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950 rounded h-1.5"
                />
              </div>
            )}

            {/* Compliance Air Buffer */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Compliance Air Volume:</span>
                <span className="font-mono font-bold text-purple-400">{complianceChamberAirMl} mL</span>
              </div>
              <input
                type="range"
                min="100"
                max="800"
                step="50"
                value={complianceChamberAirMl}
                onChange={(e) => setComplianceChamberAirMl(parseInt(e.target.value))}
                className="w-full accent-purple-500 bg-slate-950 rounded h-1.5"
              />
            </div>

            {/* Throttle Resistance */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Peripheral Throttle Resistance:</span>
                <span className="font-mono font-bold text-emerald-400">{throttleValveResistanceR.toFixed(2)} PRU</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={throttleValveResistanceR}
                onChange={(e) => setThrottleValveResistanceR(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 rounded h-1.5"
              />
            </div>

            {/* Blood Analog Fluid Selection */}
            <div className="space-y-1 text-xs">
              <span className="text-slate-300 block font-semibold">Blood-Mimicking Fluid:</span>
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {[
                  { id: 'water_glycerol_40', label: '40% Water-Glycerol (3.5 cP Newtonian)' },
                  { id: 'sodium_iodide_viscous', label: 'Sodium Iodide / Xanthan (Shear-thinning refractive)' },
                  { id: 'saline_water', label: '0.9% Normal Saline (Low viscosity 1.0 cP)' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setBloodAnalogFluid(f.id as any)}
                    className={`py-1.5 px-2.5 rounded-lg border text-left font-mono text-[11px] transition-all ${
                      bloodAnalogFluid === f.id
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
