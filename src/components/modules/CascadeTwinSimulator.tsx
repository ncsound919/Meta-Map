import React, { useState, useEffect } from 'react';
import { Slider } from '../ui/Slider';
import { CascadeTwinArchTabs } from './cascadetwin/CascadeTwinArchTabs';

import { OrganSite, PrimaryCancerType } from '../../types/metastasis';
import {
  Cpu,
  Play,
  Zap,
  Activity,
  Sliders,
  Sparkles,
  Download,
  Clock,
  Compass,
  Layers,
  Flame,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Radio,
  FlaskConical,
  Beaker,
  Database,
  BarChart2,
  Wifi,
  Server,
  AlertTriangle,
  ShieldAlert,
  DollarSign,
  GitBranch,
  Binary,
  Scale,
  Gauge,
  Lock,
  Unlock,
  Network,
  Workflow,
  Terminal,
  Crosshair,
  HardDrive,
  TrendingUp,
  Percent,
  Shield,
  ArrowUpRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface CascadeTwinSimulatorProps {
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
}

export const CascadeTwinSimulator: React.FC<CascadeTwinSimulatorProps> = ({
  selectedOrgan,
  selectedCancerType
}) => {
  // Physical Microfluidic Chip State
  const [selectedChamber, setSelectedChamber] = useState<'primary' | 'bone' | 'lung' | 'liver' | 'brain'>('bone');
  const [optogeneticActive, setOptogeneticActive] = useState<boolean>(false);
  const [optogeneticGene, setOptogeneticGene] = useState<'NR2F1' | 'MMP9' | 'ESEL' | 'CD44'>('NR2F1');
  const [selectedDrug, setSelectedDrug] = useState<string>('anti_rankl');
  const [shearStress, setShearStress] = useState<number>(8.5); // dynes/cm2
  const [flowRate, setFlowRate] = useState<number>(100); // uL/min

  // Physical Live Sensor Telemetry State
  const [chamberStatus, setChamberStatus] = useState<any>({
    temperatureC: 37.0,
    pH: 7.38,
    oxygenSatPct: 96.2,
    liveCtcCount: 840,
    extravasatedCount: 42,
    optogeneticStatus: 'STANDBY'
  });

  // Digital Twin Architectural & Deployment Bottlenecks Control State
  const [activeArchTab, setActiveArchTab] = useState<'ingestion' | 'solvers' | 'interoperability' | 'security' | 'economics'>('ingestion');
  const [pinnSolverEngine, setPinnSolverEngine] = useState<'pinn_surrogate' | 'cfd_multiphysics'>('pinn_surrogate');
  const [sensorDriftCompensated, setSensorDriftCompensated] = useState<boolean>(true);
  const [emergencyStopLatched, setEmergencyStopLatched] = useState<boolean>(false);
  const [federationScope, setFederationScope] = useState<'micro' | 'meso' | 'macro'>('meso');
  const [activeSchemaFormat, setActiveSchemaFormat] = useState<'aas' | 'dtdl' | 'fhir' | 'omop'>('aas');

  // Digital Twin Simulation Parameters
  const [simTargetStage, setSimTargetStage] = useState<string>('extravasation');
  const [simTargetOrgan, setSimTargetOrgan] = useState<string>('bone');
  const [simIntervention, setSimIntervention] = useState<string>('optogenetic_dormancy');
  const [simDurationHours, setSimDurationHours] = useState<number>(12);

  // Digital Twin Output States
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isOvernightQueued, setIsOvernightQueued] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger initial counterfactual simulation on load
  useEffect(() => {
    runDigitalTwinSimulation();
  }, []);

  // Run AI Counterfactual Simulation via Backend API
  const runDigitalTwinSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/cascade-twin/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetStage: simTargetStage,
          targetOrgan: simTargetOrgan,
          interventionType: simIntervention,
          targetGene: optogeneticGene,
          durationHours: simDurationHours,
          fluidShearDynes: shearStress
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      }
    } catch (err) {
      console.error('Failed to run Cascade Twin simulation:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Execute Physical Intervention on Microfluidic Chip
  const handleExecutePhysicalIntervention = async () => {
    try {
      const res = await fetch('/api/cascade-twin/intervene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chamberId: selectedChamber,
          optogeneticState: optogeneticActive,
          drugInfusion: selectedDrug,
          shearDynes: shearStress
        })
      });
      if (res.ok) {
        const data = await res.json();
        setChamberStatus({
          temperatureC: data.physicalChipState.sensorReadings.temperatureC,
          pH: data.physicalChipState.sensorReadings.pH,
          oxygenSatPct: data.physicalChipState.sensorReadings.oxygenSatPct,
          liveCtcCount: Math.round(840 * (1 - shearStress * 0.02)),
          extravasatedCount: optogeneticActive ? 12 : 48,
          optogeneticStatus: data.physicalChipState.optogeneticLaserStatus
        });

        showToast(`Physical chip trigger executed on ${selectedChamber.toUpperCase()} chamber!`);
        // Refresh counterfactual model
        runDigitalTwinSimulation();
      }
    } catch (err) {
      console.error('Failed to trigger physical chip intervention:', err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Export Digital Twin Experiment Report
  const handleExportTwinReport = () => {
    if (!simulationResult) return;
    const jsonStr = JSON.stringify(simulationResult, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cascade_Twin_Digital_Experiment_${simulationResult.digitalTwinId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-900 text-cyan-100 border border-cyan-500 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Hybrid Physical-Digital Organ-on-a-Chip Twin
              </span>
              <span className="text-xs text-slate-400 font-mono">Closed-Loop Optogenetic & Shear Steering</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Metastasis Cascade Simulator (Cascade Twin)
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              An interactive closed-loop simulator pairing a microfluidic multi-organ chip with an AI Digital Twin. 
              Intervene at precise cascade stages with optogenetics, shear stress, or targeted therapeutics, and let AI steer real-time hypothesis generation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportTwinReport}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Digital Twin Protocol (.JSON)
            </button>
            <button
              onClick={() => {
                setIsOvernightQueued(!isOvernightQueued);
                showToast(isOvernightQueued ? "Overnight queue cancelled." : "Overnight automated experiment run queued!");
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isOvernightQueued
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {isOvernightQueued ? 'Overnight Run Queued' : 'Queue Overnight Run'}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: PHYSICAL MICROFLUIDIC MULTI-ORGAN CHIP CANVAS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              Microfluidic Multi-Organ Chip Schematic & Live Sensors
            </h3>
            <p className="text-xs text-slate-400">
              Click any organoid chamber to target real-time interventions or view non-destructive sensor feeds.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-mono text-cyan-300">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Flow Rate: {flowRate} µL/min
            </span>
            <span className="flex items-center gap-1.5 font-mono text-purple-300">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              Shear Stress: {shearStress} dynes/cm²
            </span>
          </div>
        </div>

        {/* Interactive Chip Visual Schematic */}
        <div className="relative w-full bg-slate-950 rounded-xl border border-slate-800/80 p-6 overflow-x-auto">
          <div className="min-w-[720px] flex items-center justify-between gap-4 relative">
            {/* Primary Tumor Chamber */}
            <div
              onClick={() => setSelectedChamber('primary')}
              className={`flex-1 p-4 rounded-xl border transition-all cursor-pointer relative ${
                selectedChamber === 'primary'
                  ? 'bg-cyan-950/60 border-cyan-500 shadow-lg shadow-cyan-950/50 ring-2 ring-cyan-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  Step 1: Primary Chamber
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-white">BRCA Primary Organoid</h4>
              <p className="text-[11px] text-slate-400 mt-1">Patient organoid + CAFs + M2 Macrophages</p>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">Invasion Rate:</span>
                <span className="text-amber-400 font-bold">12.4 cells/hr</span>
              </div>
            </div>

            {/* Vascular Shear Channel Connector Arrow */}
            <div className="flex flex-col items-center px-1">
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-mono text-indigo-300 mt-1">Vascular Shear</span>
            </div>

            {/* Downstream Organ Niches Grid */}
            <div className="flex-[2] grid grid-cols-2 gap-3">
              {/* Bone Niche */}
              <div
                onClick={() => setSelectedChamber('bone')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedChamber === 'bone'
                    ? 'bg-cyan-950/60 border-cyan-500 shadow-lg ring-2 ring-cyan-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-amber-300">Bone Niche</span>
                  {optogeneticActive && selectedChamber === 'bone' && (
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono border border-cyan-500/30">
                      Laser ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">Endosteal Osteoblasts + MSCs</p>
                <div className="mt-2 text-[10px] font-mono text-slate-300 flex justify-between">
                  <span>Extravasated:</span>
                  <span className="text-cyan-400 font-bold">{chamberStatus.extravasatedCount} cells</span>
                </div>
              </div>

              {/* Lung Niche */}
              <div
                onClick={() => setSelectedChamber('lung')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedChamber === 'lung'
                    ? 'bg-cyan-950/60 border-cyan-500 shadow-lg ring-2 ring-cyan-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-cyan-300">Lung Niche</span>
                </div>
                <p className="text-[10px] text-slate-400">Alveolar Epithelium + Capillaries</p>
                <div className="mt-2 text-[10px] font-mono text-slate-300 flex justify-between">
                  <span>Extravasated:</span>
                  <span className="text-cyan-400 font-bold">18 cells</span>
                </div>
              </div>

              {/* Liver Niche */}
              <div
                onClick={() => setSelectedChamber('liver')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedChamber === 'liver'
                    ? 'bg-cyan-950/60 border-cyan-500 shadow-lg ring-2 ring-cyan-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-emerald-300">Liver Niche</span>
                </div>
                <p className="text-[10px] text-slate-400">Kupffer Cells + Sinusoidal Endothelium</p>
                <div className="mt-2 text-[10px] font-mono text-slate-300 flex justify-between">
                  <span>Extravasated:</span>
                  <span className="text-cyan-400 font-bold">29 cells</span>
                </div>
              </div>

              {/* Brain Niche */}
              <div
                onClick={() => setSelectedChamber('brain')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedChamber === 'brain'
                    ? 'bg-cyan-950/60 border-cyan-500 shadow-lg ring-2 ring-cyan-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-purple-300">Brain Niche</span>
                </div>
                <p className="text-[10px] text-slate-400">Blood-Brain Barrier Astrocytes</p>
                <div className="mt-2 text-[10px] font-mono text-slate-300 flex justify-between">
                  <span>Extravasated:</span>
                  <span className="text-cyan-400 font-bold">8 cells</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: INTERVENTION STEERING CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Real-Time Chip Intervention Console
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Chamber: <span className="text-cyan-300 font-bold uppercase">{selectedChamber}</span>
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Optogenetic Controls */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-300" /> Optogenetic Light Switch
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optogeneticActive}
                    onChange={(e) => setOptogeneticActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              {optogeneticActive && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 block">Target Optogenetic Constructs:</span>
                  <select
                    value={optogeneticGene}
                    onChange={(e) => setOptogeneticGene(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-bold"
                  >
                    <option value="NR2F1">CRY2-C21 NR2F1 Dormancy Activation (470nm Blue)</option>
                    <option value="MMP9">LOV2-MMP9 Matrix Cleavage Switch (450nm)</option>
                    <option value="ESEL">PhyB-PIF E-Selectin Downregulation (660nm Red)</option>
                    <option value="CD44">Opto-CD44 Adhesion Blockade (470nm)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Local Niche Drug Infusion Pump */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block">Microfluidic Local Drug Infusion:</span>
              <select
                value={selectedDrug}
                onChange={(e) => setSelectedDrug(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-1.5 focus:outline-none"
              >
                <option value="anti_rankl">Denosumab (Anti-RANKL mAb - Bone Protection)</option>
                <option value="cmet_inhibitor">Crizotinib (c-MET Inhibitor - HGF Niche Blockade)</option>
                <option value="exosome_blocker">GW4869 (Exosome Biogenesis Blocker)</option>
                <option value="anti_pdl1">Atezolizumab (Anti-PD-L1 Immuno-Oncology)</option>
                <option value="vehicle">PBS Buffer (Vehicle Control)</option>
              </select>
            </div>

            {/* Shear Stress Adjuster Slider */}
            <div className="space-y-1">
  <Slider
  label="Vascular Fluid Shear Stress:"
  min={0.5}
  max={25.0}
  step={0.5}
  value={shearStress}
  onChange={setShearStress}
  valueDisplay={<>{shearStress} dynes/cm²</>}
/>
  <p className="text-[10px] text-slate-500">
                Physiological range: 1.0 dynes/cm² (microcapillaries) to 15.0 dynes/cm² (arterial/large vessels).
              </p>
</div>

            {/* Trigger Button */}
            <button
              onClick={handleExecutePhysicalIntervention}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              Execute Physical Intervention on Microfluidic Chip
            </button>
          </div>
        </div>

        {/* SECTION 3: DIGITAL TWIN COUNTERFACTUAL SIMULATION & RECHARTS DATA */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                AI Digital Twin Counterfactual Simulation Engine
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulates real-time "What-If" perturbation dynamics across cascade stages.
              </p>
            </div>

            <button
              onClick={runDigitalTwinSimulation}
              disabled={isSimulating}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              Re-Simulate
            </button>
          </div>

          {/* Recharts Timecourse Simulation Visualizer */}
          {simulationResult?.timecourse ? (
            <div className="space-y-4">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationResult.timecourse}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Time (Hours)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="circulatingCtcCount" name="Circulating CTCs" stroke="#38bdf8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="extravasatedCells" name="Extravasated Cells" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="dormantMicrometastases" name="Dormant Micrometastases" stroke="#a855f7" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="proliferativeOutgrowth" name="Proliferative Outgrowth" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Predictive Metrics Badges */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Extravasation Efficiency</span>
                  <span className="font-mono font-bold text-cyan-300 text-sm">
                    {simulationResult.predictedMetrics.extravasationEfficiencyPct}%
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Colonization Success</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {simulationResult.predictedMetrics.colonizationSuccessRatePct}%
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Dormancy Index</span>
                  <span className="font-mono font-bold text-purple-400 text-sm">
                    {(simulationResult.predictedMetrics.dormancyInductionIndex * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* AI Recommendation Banner */}
              {simulationResult.recommendedNextPhysicalExperiment && (
                <div className="bg-cyan-950/40 border border-cyan-800/80 rounded-xl p-3.5 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-cyan-400" />
                      AI Co-Pilot Suggested Follow-Up Experiment:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-900 text-cyan-200 text-[10px] font-mono border border-cyan-700">
                      Power: {simulationResult.recommendedNextPhysicalExperiment.statisticalPowerEstimatePct}%
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">
                    {simulationResult.recommendedNextPhysicalExperiment.title}
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {simulationResult.recommendedNextPhysicalExperiment.hypothesis}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-400 text-center py-12 text-xs">Loading Digital Twin counterfactual model...</div>
          )}
        </div>
      </div>

      {/* SECTION 4: DIGITAL TWIN TECHNICAL, COMPUTATIONAL & ARCHITECTURAL BOTTLENECKS CONSOLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-indigo-400" /> PRODUCTION ARCHITECTURE & BOTTLENECK ENGINE
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                REAL-TIME DEPLOYMENT & MAINTENANCE
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Digital Twin Technical, Computational &amp; Architectural Operational Suite
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-4xl">
              Comprehensive telemetry managing data acquisition pipelines, real-time multiphysics vs. neural ROM solvers, 
              AAS/DTDL/FHIR interoperability, IT/OT convergence, air-gapped security interlocks, and lifecycle economics.
            </p>
          </div>

          {/* Quick Health Summary Pill */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-4 shrink-0 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">SYSTEM STATUS</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ALL PIPELINES SYNCED
              </span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-[10px] text-slate-400 block font-bold">MODEL DRIFT</span>
              <span className="text-cyan-300 font-bold">1.4% (KALMAN RECALIBRATED)</span>
            </div>
          </div>
        </div>

        {/* 5-Pillar Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveArchTab('ingestion')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeArchTab === 'ingestion'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" /> Data Ingestion &amp; Quality
          </button>

          <button
            onClick={() => setActiveArchTab('solvers')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeArchTab === 'solvers'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Solvers &amp; State Recalibration
          </button>

          <button
            onClick={() => setActiveArchTab('interoperability')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeArchTab === 'interoperability'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Network className="w-3.5 h-3.5" /> Interoperability &amp; Federation
          </button>

          <button
            onClick={() => setActiveArchTab('security')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeArchTab === 'security'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Security &amp; Safety Guardrails
          </button>

          <button
            onClick={() => setActiveArchTab('economics')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeArchTab === 'economics'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Lifecycle Economics &amp; ROI
          </button>
        </div>

        {/* TAB 1: DATA INTEGRATION, INGESTION & BANDWIDTH PIPELINE */}
        {activeArchTab === 'ingestion' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              {/* Heterogeneous Feeds Table */}
              <div className="lg:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-white text-xs font-mono uppercase flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" /> Multi-Modal Heterogeneous Source Ingestion
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">OPC UA / AAS / FHIR / Kafka</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800">
                        <th className="pb-2">Data Source</th>
                        <th className="pb-2">Data Format &amp; Modality</th>
                        <th className="pb-2">Ingestion Protocol</th>
                        <th className="pb-2 text-right">Latency</th>
                        <th className="pb-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="py-2.5 font-bold text-white">Microfluidic Chip Sensors</td>
                        <td className="py-2.5 text-cyan-300">Time-Series (100 Hz Pressure/pH/O2)</td>
                        <td className="py-2.5 text-slate-400">OPC UA / MQTT Bus</td>
                        <td className="py-2.5 text-right text-emerald-400 font-bold">4.2 ms</td>
                        <td className="py-2.5 text-center"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] rounded font-bold border border-emerald-500/30">Synced</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-white">3D Spatial Mesh Geometries</td>
                        <td className="py-2.5 text-purple-300">FEA CAD Point-Cloud Mesh</td>
                        <td className="py-2.5 text-slate-400">Asset Admin Shell (AAS)</td>
                        <td className="py-2.5 text-right text-emerald-400 font-bold">12.0 ms</td>
                        <td className="py-2.5 text-center"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] rounded font-bold border border-emerald-500/30">Synced</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-white">Maintenance &amp; Lab SOP Logs</td>
                        <td className="py-2.5 text-amber-300">Unstructured SCADA &amp; Lab Notes</td>
                        <td className="py-2.5 text-slate-400">REST / Kafka Vector Embeddings</td>
                        <td className="py-2.5 text-right text-emerald-400 font-bold">24.5 ms</td>
                        <td className="py-2.5 text-center"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] rounded font-bold border border-emerald-500/30">Synced</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-white">Clinical EHR &amp; Biobank</td>
                        <td className="py-2.5 text-rose-300">HL7 FHIR v4 / OMOP CDM Loci</td>
                        <td className="py-2.5 text-slate-400">FHIR REST API</td>
                        <td className="py-2.5 text-right text-emerald-400 font-bold">45.0 ms</td>
                        <td className="py-2.5 text-center"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] rounded font-bold border border-emerald-500/30">Synced</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Quality Degradation & Edge Bandwidth Controls */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-white text-xs font-mono uppercase flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" /> Sensor Drift &amp; Bandwidth Optimizer
                  </h4>
                  <p className="text-[10px] text-slate-400">Edge-to-cloud packet loss &amp; compression telemetry</p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {/* Drift Compensator Toggle */}
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200 text-[11px]">Sensor Drift Auto-Kalman Filter</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sensorDriftCompensated}
                          onChange={(e) => setSensorDriftCompensated(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>Uncompensated Drift: <strong className="text-amber-400">0.8%</strong></span>
                      <span>Correction: <strong className={sensorDriftCompensated ? 'text-emerald-400 font-bold' : 'text-rose-400'}>{sensorDriftCompensated ? 'ACTIVE' : 'BYPASSED'}</strong></span>
                    </div>
                  </div>

                  {/* Bandwidth Compression Gauge */}
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200 text-[11px]">Edge-to-Cloud Wavelet Delta Compression</span>
                      <span className="text-cyan-300 font-bold text-[11px]">15:1 Ratio</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full w-[93%]" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                      <span>Raw Stream: 4,800 Kbps</span>
                      <span className="text-emerald-400 font-bold">Cloud Ingestion: 320 Kbps (-93.3%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MULTIPHYSICS SOLVERS VS NEURAL ROM & STATE RECALIBRATION */}
        {activeArchTab === 'solvers' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
              {/* Solver Selection & Speed Benchmark */}
              <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white text-xs font-mono uppercase flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-400" /> Solver Fidelity &amp; Speed Trade-Off
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Multiphysics Navier-Stokes CFD / FEA vs. Physics-Informed Neural Network (PINN) ROM
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                    694,444x Acceleration
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPinnSolverEngine('pinn_surrogate')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      pinnSolverEngine === 'pinn_surrogate'
                        ? 'bg-indigo-950/60 border-indigo-500 shadow-lg ring-2 ring-indigo-500/30'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-indigo-300">PINN ROM Surrogate</span>
                      <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-200 text-[9px] font-mono rounded">RECOMMENDED</span>
                    </div>
                    <div className="text-xl font-extrabold text-white font-mono mt-2">1.8 ms</div>
                    <p className="text-[10px] text-slate-400 mt-1">Real-time closed-loop control ready</p>
                    <div className="mt-2 text-[10px] font-mono text-emerald-400 font-bold">99.1% Physical Accuracy</div>
                  </div>

                  <div
                    onClick={() => setPinnSolverEngine('cfd_multiphysics')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      pinnSolverEngine === 'cfd_multiphysics'
                        ? 'bg-indigo-950/60 border-indigo-500 shadow-lg ring-2 ring-indigo-500/30'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-300">Full Multiphysics CFD</span>
                      <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[9px] font-mono rounded">FEA Solver</span>
                    </div>
                    <div className="text-xl font-extrabold text-amber-400 font-mono mt-2">1,250,000 ms</div>
                    <p className="text-[10px] text-slate-400 mt-1">High-fidelity 20.8 minute execution</p>
                    <div className="mt-2 text-[10px] font-mono text-cyan-300 font-bold">100.0% Exact Mesh CFD</div>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] leading-relaxed text-slate-300">
                  <strong className="text-indigo-300">Solver Trade-Off Rationale:</strong> The PINN Reduced-Order Model (ROM) surrogate evaluates blood plasma velocity gradients and matrix deformation fields in under 2 milliseconds, allowing real-time bidirectional feedback control without waiting for multi-hour CFD iterations.
                </div>
              </div>

              {/* OOD Safety Monitor & State Divergence Recalibration */}
              <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-xs font-mono uppercase flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Out-of-Distribution (OOD) Safety &amp; State Recalibration
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Detects surrogate hallucinations on physical edge states &amp; recalibrates model drift over time
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {/* OOD Confidence Gauge */}
                  <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">Neural ROM Confidence Score:</span>
                      <span className="text-emerald-400 font-bold text-sm">98.6% (In-Distribution)</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[98.6%]" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>OOD Fallback Threshold: 85.0%</span>
                      <span className="text-emerald-400 font-bold">Automatic Fallback: STANDBY (No OOD Alert)</span>
                    </div>
                  </div>

                  {/* State Divergence & Tissue Wear Recalibration */}
                  <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">Physical Model Divergence (State Drift):</span>
                      <span className="text-cyan-300 font-bold">1.4% (Threshold &lt; 2.0%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                      <span>Last Kalman Recalibration: <strong className="text-slate-100">1 hour ago</strong></span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded border border-emerald-500/30">
                        Synchronized
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INTEROPERABILITY & CROSS-TWIN FEDERATION */}
        {activeArchTab === 'interoperability' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
              {/* Universal Data Schema Adapter Selector */}
              <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-xs font-mono uppercase flex items-center gap-2">
                    <Network className="w-4 h-4 text-purple-400" /> Universal Interoperability Schema Transformer
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Maps digital twin states across industry standards without vendor lock-in
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 block font-bold">SELECT ACTIVE SCHEMA ADAPTER:</span>
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <button
                      onClick={() => setActiveSchemaFormat('aas')}
                      className={`p-2.5 rounded-lg border text-left font-bold transition-all ${
                        activeSchemaFormat === 'aas'
                          ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      AAS v3.0 (Asset Admin Shell)
                    </button>
                    <button
                      onClick={() => setActiveSchemaFormat('dtdl')}
                      className={`p-2.5 rounded-lg border text-left font-bold transition-all ${
                        activeSchemaFormat === 'dtdl'
                          ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      DTDL v2.1 (Digital Twins)
                    </button>
                    <button
                      onClick={() => setActiveSchemaFormat('fhir')}
                      className={`p-2.5 rounded-lg border text-left font-bold transition-all ${
                        activeSchemaFormat === 'fhir'
                          ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      HL7 FHIR r4 (Medical)
                    </button>
                    <button
                      onClick={() => setActiveSchemaFormat('omop')}
                      className={`p-2.5 rounded-lg border text-left font-bold transition-all ${
                        activeSchemaFormat === 'omop'
                          ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      OMOP CDM v6.0 (Biobank)
                    </button>
                  </div>
                </div>

                {/* Schema Code Preview Snippet */}
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1">
                    <span>Active Schema Payload ({activeSchemaFormat.toUpperCase()})</span>
                    <span className="text-emerald-400 font-bold">100% Schema Valid</span>
                  </div>
                  <pre className="text-purple-300 overflow-x-auto p-1 max-h-32">
{activeSchemaFormat === 'aas' && `{
  "id": "urn:meta-twin:aas:bone-niche-01",
  "assetAdministrationShell": {
    "assetInformation": { "assetKind": "Instance", "globalAssetId": "CHIP-MICRO-9821" },
    "submodels": [
      { "idShort": "ShearStressSubmodel", "value": "${shearStress} dyn/cm²" },
      { "idShort": "ExtravasatedCtcCount", "value": "${chamberStatus.extravasatedCount}" }
    ]
  }
}`}
{activeSchemaFormat === 'dtdl' && `{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:metamap:CascadeTwin;1",
  "@type": "Interface",
  "displayName": "Microfluidic Cascade Twin",
  "contents": [
    { "@type": "Telemetry", "name": "shearStress", "schema": "double" },
    { "@type": "Property", "name": "targetOrgan", "schema": "string" }
  ]
}`}
{activeSchemaFormat === 'fhir' && `{
  "resourceType": "DeviceMetric",
  "id": "cascade-twin-organoid-sensor",
  "status": "on",
  "category": "measurement",
  "measurementPeriod": { "repeat": { "frequency": 100 } },
  "calibration": [ { "type": "two-point", "state": "calibrated" } ]
}`}
{activeSchemaFormat === 'omop' && `{
  "measurement_id": 904821,
  "person_id": 1042,
  "measurement_concept_id": 3004218,
  "measurement_source_value": "Microfluidic Extravasation Cell Yield",
  "value_as_number": ${chamberStatus.extravasatedCount}
}`}
                  </pre>
                </div>
              </div>

              {/* Cross-Twin Federation Stack */}
              <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-xs font-mono uppercase flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-purple-400" /> Hierarchical Cross-Twin Federation Stack
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Connects micro-level asset twins (microfluidics) into systemic macro-level patient digital twins
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {/* Federation Tier 1 */}
                  <div
                    onClick={() => setFederationScope('micro')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      federationScope === 'micro'
                        ? 'bg-purple-950/60 border-purple-500 shadow-md ring-1 ring-purple-500/30'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-xs">1. Micro-Asset Twin Tier</span>
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">100 Hz Streaming</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Single organoid chamber microfluidic sensors &amp; single-cell RNA-seq tracking</p>
                  </div>

                  {/* Federation Tier 2 */}
                  <div
                    onClick={() => setFederationScope('meso')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      federationScope === 'meso'
                        ? 'bg-purple-950/60 border-purple-500 shadow-md ring-1 ring-purple-500/30'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-xs">2. Meso-Niche Twin Tier</span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold">10 Hz Integration</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Organ-specific endosteal, hepatic, alveolar &amp; blood-brain barrier pre-niche models</p>
                  </div>

                  {/* Federation Tier 3 */}
                  <div
                    onClick={() => setFederationScope('macro')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      federationScope === 'macro'
                        ? 'bg-purple-950/60 border-purple-500 shadow-md ring-1 ring-purple-500/30'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-xs">3. Macro-System Patient Twin Tier</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">1 Hz Systemic Sync</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Whole-patient systemic circulation, longitudinal PET/CT imaging &amp; treatment response forecast</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4 & 5: CYBERSECURITY, BIDIRECTIONAL CONTROL & ECONOMICS */}
        <CascadeTwinArchTabs
          activeArchTab={activeArchTab}
          emergencyStopLatched={emergencyStopLatched}
          setEmergencyStopLatched={setEmergencyStopLatched}
          flowRate={flowRate}
          showToast={showToast}
        />
      </div>
    </div>
  );
};
