import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Slider } from '../../ui/Slider';

import {
  Heart,
  Activity,
  GitBranch,
  Layers,
  Sparkles,
  Droplets,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Globe,
  Compass,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { PrimaryCancerType, OrganSite } from '../../../types/metastasis';

interface OrganNode {
  id: OrganSite;
  name: string;
  fractionalFlowPct: number; // % of systemic CO
  firstPassFilterFor: PrimaryCancerType[];
  drainageRoute: 'portal' | 'caval' | 'pulmonary_vein' | 'batsons_plexus';
  trappingEfficiencyPct: number; // per pass
  color: string;
}

const SYSTEMIC_ORGANS: OrganNode[] = [
  {
    id: 'lung',
    name: 'Pulmonary Capillaries (Lungs)',
    fractionalFlowPct: 100, // 100% of Right Ventricle CO
    firstPassFilterFor: ['Breast (BRCA)', 'Melanoma (SKCM)', 'Renal (KIRC)', 'Prostate (PRAD)'],
    drainageRoute: 'caval',
    trappingEfficiencyPct: 88,
    color: '#06b6d4' // cyan
  },
  {
    id: 'liver',
    name: 'Hepatic Sinusoids (Liver - Dual Inflow)',
    fractionalFlowPct: 28, // 21% portal + 7% hepatic artery
    firstPassFilterFor: ['Colorectal (COAD/READ)', 'Pancreatic (PAAD)'],
    drainageRoute: 'portal',
    trappingEfficiencyPct: 82,
    color: '#f59e0b' // amber
  },
  {
    id: 'bone',
    name: 'Bone Marrow Sinusoids & Spine',
    fractionalFlowPct: 6,
    firstPassFilterFor: ['Prostate (PRAD)'], // via Batson's Plexus bypass
    drainageRoute: 'batsons_plexus',
    trappingEfficiencyPct: 65,
    color: '#a855f7' // purple
  },
  {
    id: 'brain',
    name: 'Cerebral Microvasculature (Brain)',
    fractionalFlowPct: 15,
    firstPassFilterFor: ['Lung Non-Small (LUAD/LUSC)'],
    drainageRoute: 'pulmonary_vein',
    trappingEfficiencyPct: 52,
    color: '#f43f5e' // rose
  },
  {
    id: 'lymph_node',
    name: 'Regional Lymphatic Stations',
    fractionalFlowPct: 4,
    firstPassFilterFor: ['Breast (BRCA)', 'Melanoma (SKCM)'],
    drainageRoute: 'caval',
    trappingEfficiencyPct: 75,
    color: '#10b981' // emerald
  },
  {
    id: 'peritoneum',
    name: 'Peritoneal Mesothelium & Omentum',
    fractionalFlowPct: 3.5,
    firstPassFilterFor: ['Pancreatic (PAAD)', 'Colorectal (COAD/READ)'],
    drainageRoute: 'portal',
    trappingEfficiencyPct: 68,
    color: '#38bdf8' // sky
  }
];

export const WholeBodyMetastaticPerfusionNetwork: React.FC = () => {
  const [selectedPrimary, setSelectedPrimary] = useState<PrimaryCancerType>('Colorectal (COAD/READ)');
  const [injectedCtcBolus, setInjectedCtcBolus] = useState<number>(100000); // 100k CTCs
  const [cardiacOutputLMin, setCardiacOutputLMin] = useState<number>(5.0); // 3.5 to 8.0 L/min
  const [valsalvaPressureActive, setValsalvaPressureActive] = useState<boolean>(false); // Triggers Batson's plexus retrograde flow to spine
  const [currentPass, setCurrentPass] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Multi-pass dissemination simulation
  const [seedingHistory, setSeedingHistory] = useState<
    Array<{ pass: number; lung: number; liver: number; bone: number; brain: number; lymph_node: number; circulating: number }>
  >([]);

  // Calculate first pass and cumulative seeding profile across passes
  const simulationResults = useMemo(() => {
    // Initial conditions for pass 1
    let circulating = injectedCtcBolus;
    const accumulated = {
      lung: 0,
      liver: 0,
      bone: 0,
      brain: 0,
      lymph_node: 0,
      peritoneum: 0
    };

    const history = [];

    for (let pass = 1; pass <= 8; pass++) {
      if (circulating <= 5) {
        history.push({
          pass,
          lung: accumulated.lung,
          liver: accumulated.liver,
          bone: accumulated.bone,
          brain: accumulated.brain,
          lymph_node: accumulated.lymph_node,
          circulating: 0
        });
        continue;
      }

      // Step A: Primary site drainage route
      let toLungs = 0;
      let toLiver = 0;
      let toBoneDirect = 0;

      if (pass === 1) {
        // Pass 1: Anatomic direct drainage
        if (selectedPrimary === 'Colorectal (COAD/READ)' || selectedPrimary === 'Pancreatic (PAAD)') {
          // 85% drains into Portal Vein directly to Liver
          toLiver = circulating * 0.85;
          toLungs = circulating * 0.15;
        } else if (selectedPrimary === 'Prostate (PRAD)' && valsalvaPressureActive) {
          // Batson's plexus valveless retrograde flow shunts 45% straight into vertebral bone
          toBoneDirect = circulating * 0.45;
          toLungs = circulating * 0.55;
        } else if (selectedPrimary === 'Lung Non-Small (LUAD/LUSC)') {
          // Drains into pulmonary veins straight to Left Heart and systemic arterial circulation
          toLungs = 0;
        } else {
          // Standard caval venous drainage (Breast, Melanoma, Renal) -> 100% hits Pulmonary filter first
          toLungs = circulating;
        }
      } else {
        // Subsequent passes: Venous return from all organs passes through Right Heart to Lungs
        toLungs = circulating;
      }

      // 1. Pulmonary First-Pass Sieve
      const lungTrapped = Math.round(toLungs * 0.88);
      const lungEscaped = toLungs - lungTrapped;
      accumulated.lung += lungTrapped;

      // 2. Hepatic First-Pass Sieve (if direct portal input in pass 1)
      if (toLiver > 0) {
        const liverTrapped = Math.round(toLiver * 0.82);
        const liverEscaped = toLiver - liverTrapped;
        accumulated.liver += liverTrapped;
        // Escaped from liver joins hepatic veins into IVC -> Lungs
        const secondaryLungTrapped = Math.round(liverEscaped * 0.88);
        accumulated.lung += secondaryLungTrapped;
      }

      // 3. Batson's Vertebral Bone Direct Sieve
      if (toBoneDirect > 0) {
        const boneTrapped = Math.round(toBoneDirect * 0.70);
        accumulated.bone += boneTrapped;
      }

      // 4. Systemic Arterial Dissemination from Left Heart (for CTCs that cleared the pulmonary bed)
      const systemicArterialPool = lungEscaped;
      const liverArterial = Math.round(systemicArterialPool * 0.07 * 0.82);
      const brainArterial = Math.round(systemicArterialPool * 0.15 * 0.52);
      const boneArterial = Math.round(systemicArterialPool * 0.06 * 0.65);
      const lymphArterial = Math.round(systemicArterialPool * 0.04 * 0.75);

      accumulated.liver += liverArterial;
      accumulated.brain += brainArterial;
      accumulated.bone += boneArterial;
      accumulated.lymph_node += lymphArterial;

      // Hemodynamic shear & immune attrition cleans up ~25% of surviving circulating cells per circuit
      const totalNewlyTrapped = lungTrapped + liverArterial + brainArterial + boneArterial + lymphArterial;
      circulating = Math.max(0, Math.round((circulating - totalNewlyTrapped) * 0.65));

      history.push({
        pass,
        lung: accumulated.lung,
        liver: accumulated.liver,
        bone: accumulated.bone,
        brain: accumulated.brain,
        lymph_node: accumulated.lymph_node,
        circulating
      });
    }

    return {
      history,
      accumulated
    };
  }, [selectedPrimary, injectedCtcBolus, valsalvaPressureActive]);

  // Stepper / Runner Effect
  useEffect(() => {
    let timer: any = null;
    if (isSimulating) {
      timer = setInterval(() => {
        setCurrentPass((prev) => {
          if (prev >= 8) {
            setIsSimulating(false);
            return 8;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSimulating]);

  const currentSnapshot = simulationResults.history[currentPass - 1] || simulationResults.history[0];

  const organSeedingBarData = useMemo(() => {
    return [
      { name: 'Lungs', count: currentSnapshot.lung, color: '#06b6d4' },
      { name: 'Liver', count: currentSnapshot.liver, color: '#f59e0b' },
      { name: 'Bone', count: currentSnapshot.bone, color: '#a855f7' },
      { name: 'Brain', count: currentSnapshot.brain, color: '#f43f5e' },
      { name: 'Lymph Node', count: currentSnapshot.lymph_node, color: '#10b981' }
    ];
  }, [currentSnapshot]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Whole-Body Closed-Loop Hemodynamic Circuit & Dissemination Network
              </h3>
              <p className="text-xs text-slate-400">
                Multi-compartment circulatory circuit modeling anatomic venous drainage, pulmonary first-pass filtration, Batson's vertebral plexus bypass, and multi-pass recirculation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-mono flex items-center gap-1.5"
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isSimulating ? 'Pause Loop' : 'Run Dissemination'}
            </button>
            <button
              onClick={() => {
                setCurrentPass(1);
                setIsSimulating(false);
              }}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-mono flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Closed-Loop Circuit Pathway Ribbon */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-slate-400">Primary Tumor Origin:</span>
            <span className="text-white font-bold">{selectedPrimary}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Primary Drainage:</span>
            <span className="text-amber-400 font-bold">
              {selectedPrimary.includes('Colorectal') || selectedPrimary.includes('Pancreatic')
                ? 'Portal Vein -> Liver First-Pass'
                : selectedPrimary.includes('Prostate') && valsalvaPressureActive
                ? "Batson's Plexus -> Direct Vertebrae Bypass"
                : selectedPrimary.includes('Lung')
                ? 'Pulmonary Veins -> Systemic Arterial Output'
                : 'Systemic Vena Cava -> Pulmonary First-Pass'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Circulation Pass:</span>
            <span className="text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
              Pass {currentPass} of 8 (~{currentPass * 60}s elapsed)
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Primary Origin & Anatomic Shunt Controls */}
        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" /> Primary Tumor Drainage & Hemodynamics
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Cardiovascular Circuit</span>
          </div>

          <div className="space-y-3.5">
            {/* Primary Cancer Selector */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300 block">Select Primary Cancer Origin:</label>
              <select
                value={selectedPrimary}
                onChange={(e) => setSelectedPrimary(e.target.value as PrimaryCancerType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Colorectal (COAD/READ)">Colorectal (Portal System -&gt; Liver)</option>
                <option value="Breast (BRCA)">Breast (Caval Venous -&gt; Lungs)</option>
                <option value="Lung Non-Small (LUAD/LUSC)">Lung Non-Small (Pulmonary -&gt; Brain/Bones)</option>
                <option value="Prostate (PRAD)">Prostate (Batson's Plexus / Caval -&gt; Spine)</option>
                <option value="Pancreatic (PAAD)">Pancreatic (Portal / Mesenteric -&gt; Liver)</option>
                <option value="Renal (KIRC)">Renal (IVC Direct -&gt; Lungs)</option>
                <option value="Melanoma (SKCM)">Melanoma (Systemic Skin -&gt; Lungs/Brain)</option>
              </select>
            </div>

            {/* Injected CTC Bolus Slider */}
            <Slider
  label="Injected CTC Inoculum:"
  min={10000}
  max={500000}
  step={10000}
  value={injectedCtcBolus}
  onChange={setInjectedCtcBolus}
  valueDisplay={<>{injectedCtcBolus.toLocaleString()} CTCs</>}
/>

            {/* Cardiac Output Slider */}
            <Slider
  label="Cardiac Output (CO):"
  min={3.5}
  max={8.0}
  step={0.1}
  value={cardiacOutputLMin}
  onChange={setCardiacOutputLMin}
  valueDisplay={<>{cardiacOutputLMin.toFixed(1)} L/min</>}
/>

            {/* Batson's Vertebral Plexus Retrograde Shunt Toggle */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-300">
                  Batson's Plexus Shunt (Intra-abdominal Valsalva):
                </span>
                <button
                  onClick={() => setValsalvaPressureActive(!valsalvaPressureActive)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    valsalvaPressureActive
                      ? 'bg-purple-950 border border-purple-500 text-purple-200'
                      : 'bg-slate-900 border border-slate-700 text-slate-400'
                  }`}
                >
                  {valsalvaPressureActive ? 'ACTIVE (Retrograde to Spine)' : 'OFF (Standard IVC)'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Increased intra-abdominal pressure (e.g. coughing, straining) reverses flow in the valveless vertebral venous plexus, routing pelvic/prostate CTCs directly into lumbar vertebrae without pulmonary filtration.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Seeding Accumulation & Multi-Pass Line Curves */}
        <div className="xl:col-span-7 space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">REMAINING IN FLOW</span>
              <div className="text-xl font-bold font-mono text-cyan-400">
                {currentSnapshot.circulating.toLocaleString()}
              </div>
              <span className="text-[9px] text-slate-500 font-mono">Free CTCs</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">PULMONARY SEEDING</span>
              <div className="text-xl font-bold font-mono text-cyan-300">
                {currentSnapshot.lung.toLocaleString()}
              </div>
              <span className="text-[9px] text-slate-500 font-mono">Arrested in Lungs</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">HEPATIC SEEDING</span>
              <div className="text-xl font-bold font-mono text-amber-400">
                {currentSnapshot.liver.toLocaleString()}
              </div>
              <span className="text-[9px] text-slate-500 font-mono">Arrested in Liver</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">BONE MARROW SEEDING</span>
              <div className="text-xl font-bold font-mono text-purple-400">
                {currentSnapshot.bone.toLocaleString()}
              </div>
              <span className="text-[9px] text-slate-500 font-mono">Arrested in Bones</span>
            </div>
          </div>

          {/* Organ Seeding Bar Chart */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                  Organ-Specific Seeding Burden (Pass {currentPass} of 8)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Anatomic Multi-Pass Filter</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={organSeedingBarData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="count" name="Arrested CTC Count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Anatomic Route Explanatory Card */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white block">Hemodynamic Law of Dissemination</span>
              <p className="leading-relaxed">
                The first organ site encountered by venous drainage acts as an obligatory mechanical sieve, capturing the majority of circulating tumor cells.
                Secondary metastases (e.g. Brain or Bone from colorectal cancer) typically occur only after primary lung or liver capillary breakthrough or systemic arterial bypass.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
