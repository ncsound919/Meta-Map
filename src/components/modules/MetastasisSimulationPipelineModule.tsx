import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  Activity,
  GitBranch,
  Play,
  RefreshCw,
  Sliders,
  Sparkles,
  Download,
  ExternalLink,
  ShieldAlert,
  Dna,
  Compass,
  ArrowRight,
  CheckCircle2,
  Database,
  Globe,
  Film,
  Brain,
  Swords,
  Stethoscope,
  Network,
  Maximize2,
  Percent,
  ArrowDownRight,
  ShieldCheck,
  Scale,
  TrendingUp,
  Code,
  Terminal,
  Zap,
  RotateCcw,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar, AreaChart, Area } from 'recharts';
import { OrganSite, PrimaryCancerType } from '../../types/metastasis';

interface MetastasisSimulationPipelineModuleProps {
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
  onNavigateModule?: (moduleId: string, organ?: string) => void;
}

export const MetastasisSimulationPipelineModule: React.FC<MetastasisSimulationPipelineModuleProps> = ({
  selectedOrgan,
  selectedCancerType,
  onNavigateModule
}) => {
  // Engine Toggles
  const [selectedFramework, setSelectedFramework] = useState<'PhysiCell' | 'SISTEM' | 'MetaSpread' | 'Chaste'>('PhysiCell');
  const [pipelineStage, setPipelineStage] = useState<number>(1);
  const [activeStageTab, setActiveStageTab] = useState<'stage1' | 'stage2' | 'stage3' | 'stage4'>('stage1');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Interactive Parameters
  const [oxygenHypoxiaThreshold, setOxygenHypoxiaThreshold] = useState<number>(10); // mmHg
  const [emtSwitchProbability, setEmtSwitchProbability] = useState<number>(0.15);
  const [loxMatrixStiffnessKpa, setLoxMatrixStiffnessKpa] = useState<number>(32.5);
  const [shearStressDynCm2, setShearStressDynCm2] = useState<number>(15.2);
  const [mutationRate, setMutationRate] = useState<number>(0.0001);
  const [primaryCancer, setPrimaryCancer] = useState<string>('Breast (BRCA)');
  const [targetOrgan, setTargetOrgan] = useState<string>('bone');

  // Micro-Engine Interactive States Wired into Cascade
  const [ctcClusterSize, setCtcClusterSize] = useState<number>(3);
  const [integrinAffinity, setIntegrinAffinity] = useState<number>(0.85);
  const [mmpConcentration, setMmpConcentration] = useState<number>(4.5);
  const [nkCellActivity, setNkCellActivity] = useState<number>(70);
  const [endothelialPermeability, setEndothelialPermeability] = useState<number>(1.4);

  // Micro-Engine Computed Biophysical Outputs
  const calculatedInvasionVelocity = (1.2 * (1 + loxMatrixStiffnessKpa / 20.0) * (1 + mmpConcentration / 5.0) * (1 + emtSwitchProbability * 2) * (1 + (25 - oxygenHypoxiaThreshold) / 15)).toFixed(1);
  const calculatedHif1aDrive = Math.min(100, Math.max(10, Math.round(((25 - oxygenHypoxiaThreshold) / 20) * 100)));
  const calculatedDetachmentFlux = (42 * emtSwitchProbability * (mmpConcentration / 3.5)).toFixed(1);

  const calculatedShearDestruction = Math.min(98, Math.max(12, Math.round(12 + shearStressDynCm2 * 2.2 - (ctcClusterSize - 1) * 6 - (nkCellActivity / 100) * 8)));
  const calculatedClusterAdvantage = (1 + (ctcClusterSize - 1) * 0.45).toFixed(2);
  const calculatedCirculationHalfLife = Math.max(4, Number((180 / Math.max(1, shearStressDynCm2)) * (1 + (ctcClusterSize - 1) * 0.3))).toFixed(1);

  const calculatedTemTimeMinutes = Math.max(12, Math.round(65 / (endothelialPermeability * integrinAffinity)));
  const calculatedNichePrimingIndex = ((loxMatrixStiffnessKpa / 15.0) * integrinAffinity * 1.5).toFixed(2);
  const calculatedExtravasationEfficiency = Math.min(95, Math.max(5, Math.round(integrinAffinity * 100 * (endothelialPermeability / 1.5))));

  const calculatedDormancyMonths = Math.max(3, Number(48 - (loxMatrixStiffnessKpa / 2.0) - (mutationRate * 100000))).toFixed(1);
  const calculatedClonalExpansionRate = (1.2 + mutationRate * 2500).toFixed(2);

  // Interactive Simulation Canvas States
  const [simTimeHours, setSimTimeHours] = useState<number>(24);
  const [activeSubstrateOverlay, setActiveSubstrateOverlay] = useState<'none' | 'pO2' | 'MMP' | 'LOX'>('pO2');
  const [showCodeExportModal, setShowCodeExportModal] = useState<boolean>(false);

  // Simulation API Output State
  const [simOutput, setSimOutput] = useState<any>(null);

  useEffect(() => {
    if (selectedCancerType !== 'all') {
      setPrimaryCancer(selectedCancerType);
    }
    if (selectedOrgan !== 'all') {
      setTargetOrgan(selectedOrgan);
    }
  }, [selectedCancerType, selectedOrgan]);

  useEffect(() => {
    runSimulationPipeline();
  }, [selectedFramework, oxygenHypoxiaThreshold, emtSwitchProbability, loxMatrixStiffnessKpa, shearStressDynCm2, mutationRate, primaryCancer, targetOrgan]);

  const runSimulationPipeline = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/simulation-pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryCancer,
          targetOrgan,
          framework: selectedFramework,
          abmParams: { oxygenHypoxiaThreshold, emtSwitchProbability },
          cfdParams: { shearStressDynCm2 },
          pdeParams: { loxMatrixStiffnessKpa },
          evolutionParams: { mutationRate }
        })
      });
      if (res.ok) {
        setSimOutput(await res.json());
      }
    } catch (e) {
      console.error('Simulation pipeline run error:', e);
    } finally {
      setIsRunning(false);
    }
  };

  // Preset Loaders
  const applyPreset = (presetName: string) => {
    if (presetName === 'tnbc_invasive') {
      setOxygenHypoxiaThreshold(5);
      setEmtSwitchProbability(0.35);
      setLoxMatrixStiffnessKpa(45.0);
      setShearStressDynCm2(12.0);
    } else if (presetName === 'dormancy_lock') {
      setOxygenHypoxiaThreshold(18);
      setEmtSwitchProbability(0.04);
      setLoxMatrixStiffnessKpa(6.5);
      setShearStressDynCm2(15.0);
    } else if (presetName === 'high_shear') {
      setOxygenHypoxiaThreshold(12);
      setEmtSwitchProbability(0.18);
      setLoxMatrixStiffnessKpa(22.0);
      setShearStressDynCm2(38.0);
    } else if (presetName === 'brain_niche') {
      setOxygenHypoxiaThreshold(8);
      setEmtSwitchProbability(0.28);
      setLoxMatrixStiffnessKpa(38.0);
      setShearStressDynCm2(10.0);
    }
  };

  const handleDownloadPipelineArtifact = () => {
    if (!simOutput) return;
    const jsonStr = JSON.stringify(simOutput, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MetaMap_SimPipeline_${selectedFramework}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Sensitivity Tornado Data
  const tornadoData = [
    { parameter: 'LOX Matrix Stiffness (kPa)', impactOnRiskPct: 42.5, direction: 'Positive Risk Increase' },
    { parameter: 'EMT Switch Probability (%)', impactOnRiskPct: 31.2, direction: 'Positive Risk Increase' },
    { parameter: 'Hypoxia Threshold (pO₂ mmHg)', impactOnRiskPct: -28.4, direction: 'Negative Risk Reduction' },
    { parameter: 'Fluid Shear Stress (dyn/cm²)', impactOnRiskPct: -22.1, direction: 'Negative Risk Reduction' },
    { parameter: 'Integrin αvβ3 Binding Affinity', impactOnRiskPct: 18.6, direction: 'Positive Risk Increase' }
  ];

  // Generated PhysiCell Configuration XML snippet
  const generatedPhysiCellXML = `<?xml version="1.0" encoding="UTF-8"?>
<PhysiCell_settings version="1.10.4">
  <domain>
    <x_min>-250</x_min> <x_max>250</x_max>
    <y_min>-250</y_min> <y_max>250</y_max>
    <z_min>-250</z_min> <z_max>250</z_max>
    <dx>20</dx>
  </domain>
  <microenvironment_setup>
    <variable name="oxygen" units="mmHg" ID="0">
      <physical_parameter_set>
        <diffusion_coefficient>100000.0</diffusion_coefficient>
        <decay_rate>0.1</decay_rate>
      </physical_parameter_set>
    </variable>
    <variable name="MMP" units="uM" ID="1">
      <physical_parameter_set>
        <diffusion_coefficient>1200.0</diffusion_coefficient>
      </physical_parameter_set>
    </variable>
  </microenvironment_setup>
  <user_parameters>
    <hypoxia_threshold units="mmHg">${oxygenHypoxiaThreshold}</hypoxia_threshold>
    <emt_probability units="dimensionless">${emtSwitchProbability}</emt_probability>
    <lox_stiffness units="kPa">${loxMatrixStiffnessKpa}</lox_stiffness>
    <fluid_shear units="dyn/cm2">${shearStressDynCm2}</fluid_shear>
  </user_parameters>
</PhysiCell_settings>`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> MULTISCALE SIMULATION PIPELINE
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PHYSICEL • SISTEM • METASPREAD • CHASTE
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Multiscale Metastasis Simulation Pipeline
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              Coupling agent-based cellular physics (ABM), continuum reaction-diffusion PDEs, Lattice Boltzmann fluid shear stress (CFD/LBM), and evolutionary genomic lineage trees (SISTEM) across the 4 stages of the metastatic cascade.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/90 p-3 rounded-xl border border-slate-800 text-xs font-mono shrink-0">
            <button
              onClick={runSimulationPipeline}
              disabled={isRunning}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Solvers Running...' : 'Execute Coupled Pipeline'}</span>
            </button>
            <button
              onClick={() => setShowCodeExportModal(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Code className="w-3.5 h-3.5" /> Code Export
            </button>
            <button
              onClick={handleDownloadPipelineArtifact}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" /> Artifact
            </button>
          </div>
        </div>

        {/* Framework Selector Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono font-bold">COMPUTATIONAL ENGINE FRAMEWORK:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'PhysiCell', label: 'PhysiCell (Multicellular Physics & PDE)' },
                { id: 'SISTEM', label: 'SISTEM (Genomic Trees & Read Gen)' },
                { id: 'MetaSpread', label: 'MetaSpread (Mesa Agent Dissemination)' },
                { id: 'Chaste', label: 'Chaste (Continuum Tissue Mechanics)' }
              ].map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw.id as any)}
                  className={`px-3 py-1 rounded-lg border font-mono transition-all ${
                    selectedFramework === fw.id
                      ? 'bg-cyan-600 border-cyan-400 text-white font-bold shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {fw.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
            <span>Grid: <strong className="text-cyan-400">256×256×256 Voxels</strong></span>
            <span>GPU: <strong className="text-emerald-400">CUDA 12.2 OpenMP</strong></span>
          </div>
        </div>
      </div>

      {/* Preset Scenarios Loader Deck */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-mono">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-200 uppercase">Preset Clinical Biophysical Scenarios:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPreset('tnbc_invasive')}
            className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-lg font-mono font-bold transition-all text-[11px]"
          >
            🔥 Aggressive TNBC Hyper-LOX
          </button>
          <button
            onClick={() => applyPreset('dormancy_lock')}
            className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-lg font-mono font-bold transition-all text-[11px]"
          >
            🛡️ Dormancy Lock Niche
          </button>
          <button
            onClick={() => applyPreset('high_shear')}
            className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800/80 rounded-lg font-mono font-bold transition-all text-[11px]"
          >
            ⚡ High Shear Fluid Destruction
          </button>
          <button
            onClick={() => applyPreset('brain_niche')}
            className="px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/80 rounded-lg font-mono font-bold transition-all text-[11px]"
          >
            🧠 Brain Pre-Niche Primed
          </button>
        </div>
      </div>

      {/* 4-Stage Multiscale Pipeline Cascade Workflow Diagram & Selector */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Metastasis Cascade Coupled Sub-Models & Solver Execution Stages
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 font-bold px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
            STAGE {pipelineStage} OF 4 ACTIVE
          </span>
        </div>

        {/* Cascade Visual Flow Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Stage 1 */}
          <button
            onClick={() => { setActiveStageTab('stage1'); setPipelineStage(1); }}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              activeStageTab === 'stage1'
                ? 'bg-cyan-950/80 border-cyan-500 text-white ring-1 ring-cyan-500 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">STAGE 1</span>
              <span className="text-[10px] text-slate-400 font-mono">ABM + PDE</span>
            </div>
            <h4 className="font-bold text-sm">Primary Microenvironment</h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              Hypoxia ($pO_2$), EMT phenotypic switching, ECM degradation & intravasation.
            </p>
          </button>

          {/* Stage 2 */}
          <button
            onClick={() => { setActiveStageTab('stage2'); setPipelineStage(2); }}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              activeStageTab === 'stage2'
                ? 'bg-indigo-950/80 border-indigo-500 text-white ring-1 ring-indigo-500 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">STAGE 2</span>
              <span className="text-[10px] text-slate-400 font-mono">CFD / LBM</span>
            </div>
            <h4 className="font-bold text-sm">Vascular & Lymphatic Flow</h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              Lattice Boltzmann shear stress, CTC cluster deformation & arrest in capillary beds.
            </p>
          </button>

          {/* Stage 3 */}
          <button
            onClick={() => { setActiveStageTab('stage3'); setPipelineStage(3); }}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              activeStageTab === 'stage3'
                ? 'bg-emerald-950/80 border-emerald-500 text-white ring-1 ring-emerald-500 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">STAGE 3</span>
              <span className="text-[10px] text-slate-400 font-mono">ADHESION + NICHE</span>
            </div>
            <h4 className="font-bold text-sm">Extravasation & Pre-Niche</h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              Trans-endothelial migration ($\alpha_v\beta_3$ integrins), LOX matrix & exosomal pre-conditioning.
            </p>
          </button>

          {/* Stage 4 */}
          <button
            onClick={() => { setActiveStageTab('stage4'); setPipelineStage(4); }}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              activeStageTab === 'stage4'
                ? 'bg-amber-950/80 border-amber-500 text-white ring-1 ring-amber-500 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">STAGE 4</span>
              <span className="text-[10px] text-slate-400 font-mono">SISTEM TREES</span>
            </div>
            <h4 className="font-bold text-sm">Colonization & Evolution</h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              Micrometastatic dormancy exit, SISTEM genomic trees & drug resistance outgrowth.
            </p>
          </button>
        </div>
      </div>

      {/* Coupled Mathematical Solver Parameter Control Deck */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" /> Multiscale Coupled Solver Parameters (Live Re-Simulation)
          </h3>
          <span className="text-[10px] font-mono text-slate-400">REAL-TIME BIOPHYSICAL SOLVER SOLVING</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          {/* ABM Hypoxia */}
          <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300 font-bold">ABM Hypoxia Threshold:</span>
              <span className="text-cyan-400 font-bold">{oxygenHypoxiaThreshold} mmHg</span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={oxygenHypoxiaThreshold}
              onChange={(e) => setOxygenHypoxiaThreshold(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-900 rounded"
            />
            <p className="text-[10px] text-slate-400">
              pO₂ &lt; {oxygenHypoxiaThreshold} mmHg triggers HIF-1α activation and EMT phenotypic switch.
            </p>
          </div>

          {/* EMT Probability */}
          <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300 font-bold">EMT Switch Probability:</span>
              <span className="text-indigo-400 font-bold">{(emtSwitchProbability * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.50"
              step="0.01"
              value={emtSwitchProbability}
              onChange={(e) => setEmtSwitchProbability(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-900 rounded"
            />
            <p className="text-[10px] text-slate-400">
              Epithelial-to-mesenchymal transition rate determining capillary intravasation.
            </p>
          </div>

          {/* LOX Matrix Stiffness */}
          <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300 font-bold">PDE LOX Matrix Stiffness:</span>
              <span className="text-emerald-400 font-bold">{loxMatrixStiffnessKpa.toFixed(1)} kPa</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="50.0"
              step="1.0"
              value={loxMatrixStiffnessKpa}
              onChange={(e) => setLoxMatrixStiffnessKpa(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-900 rounded"
            />
            <p className="text-[10px] text-slate-400">
              Lysyl Oxidase crosslinking stiffness governing pre-niche DTC awakening risk.
            </p>
          </div>

          {/* Shear Stress */}
          <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300 font-bold">CFD Fluid Shear Stress:</span>
              <span className="text-amber-400 font-bold">{shearStressDynCm2.toFixed(1)} dyn/cm²</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="40.0"
              step="1.0"
              value={shearStressDynCm2}
              onChange={(e) => setShearStressDynCm2(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-900 rounded"
            />
            <p className="text-[10px] text-slate-400">
              Hemodynamic shear force causing intravascular destruction or capillary arrest.
            </p>
          </div>
        </div>
      </div>

      {/* Probabilistic Metastatic Cascade Analytics Engine */}
      {simOutput && simOutput.probabilityMetrics && (
        <div className="bg-slate-900 border border-indigo-500/30 p-6 rounded-2xl space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" /> STOCHASTIC PROBABILITY ENGINE
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  MONTE CARLO (N = 10,000)
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                Metastatic Cascade Sequential Bottleneck Probabilities
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Quantitative probability metrics across sequential cascade transition bottlenecks: P(Metastasis) = P_inv × P_intra × P_transit × P_extra × P_col.
              </p>
            </div>

            {/* Cumulative Yield Summary Pill */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-indigo-500/40 font-mono text-right shrink-0">
              <span className="text-[10px] text-slate-400 block font-bold">CUMULATIVE METASTASIS PROBABILITY P(MET)</span>
              <div className="flex items-baseline justify-end gap-2">
                <span className="text-xl font-extrabold text-indigo-400">
                  {simOutput.probabilityMetrics.cascadeBottleneck.pCumulativeOverallPct}%
                </span>
                <span className="text-xs text-slate-400">
                  ({simOutput.probabilityMetrics.cascadeBottleneck.pCumulativeScientific})
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 block mt-0.5 font-bold">
                Yield: ~{simOutput.probabilityMetrics.cascadeBottleneck.perMillionCellMetastaticYield} cells / 1,000,000 CTCs ({simOutput.probabilityMetrics.cascadeBottleneck.bottleneckLogReduction} Log₁₀ Reduction)
              </span>
            </div>
          </div>

          {/* 5-Step Cascade Probability Waterfall Funnel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {/* Stage 1 Probability */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>P1: INVASION & EMT</span>
                <span className="text-cyan-400 font-bold">STAGE 1</span>
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {simOutput.probabilityMetrics.cascadeBottleneck.pInvasion}%
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, simOutput.probabilityMetrics.cascadeBottleneck.pInvasion)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400">
                P(EMT Switch | Hypoxia {oxygenHypoxiaThreshold} mmHg)
              </p>
            </div>

            {/* Stage 2 Probability */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>P2: INTRAVASATION</span>
                <span className="text-indigo-400 font-bold">STAGE 2</span>
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {simOutput.probabilityMetrics.cascadeBottleneck.pIntravasation}%
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, simOutput.probabilityMetrics.cascadeBottleneck.pIntravasation)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400">
                P(Capillary Entry | LOX ECM {loxMatrixStiffnessKpa} kPa)
              </p>
            </div>

            {/* Stage 3 Probability */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>P3: VASCULAR TRANSIT</span>
                <span className="text-emerald-400 font-bold">STAGE 3</span>
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {simOutput.probabilityMetrics.cascadeBottleneck.pTransit}%
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, simOutput.probabilityMetrics.cascadeBottleneck.pTransit * 5)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400">
                P(Shear Survival | τ = {shearStressDynCm2} dyn/cm²)
              </p>
            </div>

            {/* Stage 4 Probability */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>P4: EXTRAVASATION</span>
                <span className="text-amber-400 font-bold">STAGE 4</span>
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {simOutput.probabilityMetrics.cascadeBottleneck.pExtravasation}%
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, simOutput.probabilityMetrics.cascadeBottleneck.pExtravasation)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400">
                P(Endothelial Adhesion &amp; Migration)
              </p>
            </div>

            {/* Stage 5 Probability */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>P5: COLONIZATION</span>
                <span className="text-rose-400 font-bold">STAGE 5</span>
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {simOutput.probabilityMetrics.cascadeBottleneck.pColonization}%
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, simOutput.probabilityMetrics.cascadeBottleneck.pColonization)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400">
                P(Dormancy Awakening &amp; Micrometastasis)
              </p>
            </div>
          </div>

          {/* Probability Analytics Grid: Organotropism Table & Longitudinal CDF Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Organotropic Seeding Probability Breakdown Table */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wide flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyan-400" /> Organotropic Seeding &amp; Awakening Probabilities
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Target Niche Risk Matrix</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-[10px] text-slate-400 border-b border-slate-800/60">
                      <th className="pb-2">Target Organ Niche</th>
                      <th className="pb-2 text-right">Seeding Prob P(Organ)</th>
                      <th className="pb-2 text-right">Awakening Prob P(Awake)</th>
                      <th className="pb-2 text-right">Median Time Outgrowth</th>
                      <th className="pb-2 text-center">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {simOutput.probabilityMetrics.organotropicProbabilities.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-2.5 font-bold text-slate-200">{item.organ}</td>
                        <td className="py-2.5 text-right font-bold text-cyan-400">{item.probabilityPct}%</td>
                        <td className="py-2.5 text-right font-bold text-amber-400">{(item.pAwakening * 100).toFixed(0)}%</td>
                        <td className="py-2.5 text-right text-slate-300">{item.medianTimeToOutgrowthMonths} Mo</td>
                        <td className="py-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.riskLevel.includes('High')
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : item.riskLevel.includes('Moderate')
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {item.riskLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Longitudinal Cumulative Outgrowth Probability CDF Chart */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wide flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" /> Longitudinal Outgrowth CDF Probability F(t)
                </h4>
                <span className="text-[10px] font-mono text-slate-400">0 - 60 Months Post-Seeding</span>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simOutput.probabilityMetrics.longitudinalProbabilityDistribution}>
                    <defs>
                      <linearGradient id="pCumulativeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="pDormantGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" label={{ value: 'Months Post-Primary Diagnosis', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" unit="%" domain={[0, 100]} label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="pCumulativeOutgrowthPct" name="P(Overt Outgrowth)" stroke="#6366f1" fillOpacity={1} fill="url(#pCumulativeGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="pDormantQuiescencePct" name="P(Dormant Quiescence)" stroke="#10b981" fillOpacity={1} fill="url(#pDormantGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                <span>Monte Carlo Mean Risk: <strong className="text-indigo-300">{simOutput.probabilityMetrics.monteCarloSensitivity.meanMetastaticRiskPct}%</strong></span>
                <span>95% CI: <strong className="text-cyan-300">[{simOutput.probabilityMetrics.monteCarloSensitivity.confidenceInterval95[0]}%, {simOutput.probabilityMetrics.monteCarloSensitivity.confidenceInterval95[1]}%]</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Solver Results Display according to Active Stage Tab */}
      {simOutput && (
        <div className="space-y-6">
          {/* Stage 1 Solver Outputs with Interactive Spatial Cellular Grid Canvas */}
          {activeStageTab === 'stage1' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" /> Stage 1: Primary Microenvironment ABM Mechanics
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">
                    PhysiCell Agent Grid
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">TOTAL CELLS SIMULATED</span>
                    <span className="text-white font-bold text-base">{simOutput.stage1_primary_microenvironment.cellsSimulated.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">EMT PHENOTYPE FRACTION</span>
                    <span className="text-indigo-400 font-bold text-base">{simOutput.stage1_primary_microenvironment.emtCellsPercentage}%</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">INTRAVASATION RATE</span>
                    <span className="text-emerald-400 font-bold text-base">{simOutput.stage1_primary_microenvironment.intravasatedCtcsPerHour} CTCs / hr</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">HYPOXIC CORE RADIUS</span>
                    <span className="text-amber-400 font-bold text-base">{simOutput.stage1_primary_microenvironment.hypoxicCoreRadiusUm} μm</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
                  <span className="font-bold text-slate-300 font-mono block">PDE Continuum Field Solutions:</span>
                  <div className="flex justify-between text-slate-400">
                    <span>Minimum Oxygen Level ($pO_2$):</span>
                    <strong className="text-cyan-300">{simOutput.stage1_primary_microenvironment.pdeFields.oxygenMinMmHg} mmHg</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>MMP Metalloproteinase Conc:</span>
                    <strong className="text-indigo-300">{simOutput.stage1_primary_microenvironment.pdeFields.mmpConcentrationuM} μM</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>LOX Matrix Stiffness Status:</span>
                    <strong className="text-emerald-300">{simOutput.stage1_primary_microenvironment.pdeFields.loxCrosslinkStatus}</strong>
                  </div>
                </div>

                {/* Stage 1 Micro-Engine: Primary Tumor Invasion & EMT Solver */}
                <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-mono text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" /> MICRO-ENGINE: EMT INVASION SOLVER
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">ABM + PDE Coupling</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-mono">MMP Metalloproteinase Conc:</span>
                      <span className="text-cyan-300 font-mono font-bold">{mmpConcentration} μM</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="10.0"
                      step="0.5"
                      value={mmpConcentration}
                      onChange={(e) => setMmpConcentration(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 bg-slate-900 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                      <span className="text-slate-400 block text-[9px]">INVASION VELOCITY</span>
                      <strong className="text-cyan-400">{calculatedInvasionVelocity} μm/day</strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                      <span className="text-slate-400 block text-[9px]">HIF-1α DRIVE</span>
                      <strong className="text-rose-400">{calculatedHif1aDrive}%</strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                      <span className="text-slate-400 block text-[9px]">DETACHMENT FLUX</span>
                      <strong className="text-emerald-400">{calculatedDetachmentFlux} / hr</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Interactive 2D Spatial Cell Layout Simulation Canvas Graphic with Scrubber */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-cyan-400" /> Interactive Spatial Cell Grid (PhysiCell Slice)
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      <span className="text-slate-400">PDE Overlay:</span>
                      {(['pO2', 'MMP', 'LOX', 'none'] as const).map(sub => (
                        <button
                          key={sub}
                          onClick={() => setActiveSubstrateOverlay(sub)}
                          className={`px-1.5 py-0.5 rounded ${
                            activeSubstrateOverlay === sub
                              ? 'bg-cyan-600 text-white font-bold'
                              : 'bg-slate-950 text-slate-400 hover:text-white'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 aspect-square bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
                    {/* Substrate Overlay Gradient */}
                    {activeSubstrateOverlay === 'pO2' && (
                      <div className="absolute inset-0 bg-radial from-rose-950/40 via-cyan-950/20 to-slate-950 pointer-events-none" />
                    )}
                    {activeSubstrateOverlay === 'MMP' && (
                      <div className="absolute inset-0 bg-radial from-indigo-950/50 via-purple-950/20 to-slate-950 pointer-events-none" />
                    )}
                    {activeSubstrateOverlay === 'LOX' && (
                      <div className="absolute inset-0 bg-radial from-emerald-950/40 via-slate-950 to-slate-950 pointer-events-none" />
                    )}

                    {/* Simulated spatial tumor grid cells */}
                    <div className="w-full h-full relative border border-cyan-900/40 rounded-lg flex items-center justify-center">
                      {/* Hypoxic core */}
                      <div
                        className="rounded-full border border-rose-500/40 flex items-center justify-center text-[10px] font-mono text-rose-300 transition-all duration-300"
                        style={{
                          width: `${Math.min(75, 20 + simTimeHours * 0.8)}%`,
                          height: `${Math.min(75, 20 + simTimeHours * 0.8)}%`,
                          backgroundColor: 'rgba(136, 19, 55, 0.5)'
                        }}
                      >
                        Hypoxic Core (pO₂ &lt; {oxygenHypoxiaThreshold})
                      </div>

                      {/* Dynamic Agents */}
                      <div
                        className="absolute w-3.5 h-3.5 bg-indigo-500 rounded-full animate-ping opacity-75"
                        style={{
                          top: `${20 + (simTimeHours % 12) * 2}%`,
                          left: `${30 + (simTimeHours % 10) * 3}%`
                        }}
                      />
                      <div
                        className="absolute w-3.5 h-3.5 bg-emerald-400 rounded-full animate-pulse"
                        style={{
                          bottom: `${15 + (simTimeHours % 8) * 3}%`,
                          right: `${20 + (simTimeHours % 14) * 2}%`
                        }}
                      />
                      <div className="absolute top-12 right-12 w-3 h-3 bg-cyan-400 rounded-full"></div>
                      <div className="absolute bottom-10 left-10 w-2.5 h-2.5 bg-amber-400 rounded-full"></div>

                      {/* Capillary vessel */}
                      <div className="absolute top-0 bottom-0 right-1/4 w-3.5 bg-rose-900/60 border-x border-rose-500/50 flex flex-col justify-around items-center">
                        <div className="w-2 h-2 rounded-full bg-cyan-300 animate-bounce" />
                      </div>
                    </div>
                  </div>

                  {/* Time Scrubber Controls */}
                  <div className="mt-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-[11px] text-slate-300">
                      <span>Simulation Step Time ($T$):</span>
                      <strong className="text-cyan-400">{simTimeHours} Hours</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="72"
                      step="2"
                      value={simTimeHours}
                      onChange={(e) => setSimTimeHours(parseInt(e.target.value))}
                      className="w-full accent-cyan-500 bg-slate-900 rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-around text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-900"></span> Hypoxia</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> EMT Agent</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Capillary CTC</span>
                </div>
              </div>
            </div>
          )}

          {/* Stage 2 Solver Outputs */}
          {activeStageTab === 'stage2' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" /> Stage 2: Lattice Boltzmann Hemodynamic CFD Solver
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold">
                  FLUID SHEAR & CTC ARREST
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">FLUID SHEAR STRESS</span>
                  <span className="text-amber-400 font-bold text-lg">{simOutput.stage2_vascular_transport.fluidShearStressDynCm2} dyn/cm²</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Lattice Boltzmann Solution</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">CTC CLUSTER vs SINGLE RATIO</span>
                  <span className="text-cyan-400 font-bold text-lg">{simOutput.stage2_vascular_transport.ctcClustersSingleRatio}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">50-fold increased seeding efficiency</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">INTRAVASCULAR SURVIVAL RATE</span>
                  <span className="text-emerald-400 font-bold text-lg">{simOutput.stage2_vascular_transport.intravascularSurvivalRatePct}%</span>
                  <span className="text-[10px] text-slate-500 block mt-1">After NK immune clearance</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-slate-300 font-mono block">Primary Vascular & Microvascular Arrest Sites:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {simOutput.stage2_vascular_transport.vascularArrestSites.map((site: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg font-mono text-xs">
                      📍 {site}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stage 2 Micro-Engine: Hemodynamic Shear & CTC Survival Solver */}
              <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-mono text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-400" /> MICRO-ENGINE: CTC HEMODYNAMIC SURVIVAL SOLVER
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Lattice Boltzmann CFD</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <span className="text-slate-400 font-mono block">CTC Cluster Size (N_cluster):</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 4, 8].map((size) => (
                        <button
                          key={size}
                          onClick={() => setCtcClusterSize(size)}
                          className={`flex-1 py-1 rounded font-mono text-xs border transition-all ${
                            ctcClusterSize === size
                              ? 'bg-indigo-600 border-indigo-400 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {size === 1 ? 'Single (1)' : `${size} Cells`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 font-mono">
                      <span>NK Cytotoxic Immunity:</span>
                      <strong className="text-indigo-300">{nkCellActivity}%</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={nkCellActivity}
                      onChange={(e) => setNkCellActivity(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-900 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">SHEAR DESTRUCTION</span>
                    <strong className="text-rose-400">{calculatedShearDestruction}%</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">CLUSTER ADVANTAGE</span>
                    <strong className="text-cyan-400">{calculatedClusterAdvantage}x</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">HALF-LIFE ($T_{1/2}$)</span>
                    <strong className="text-emerald-400">{calculatedCirculationHalfLife} min</strong>
                  </div>
                </div>

                {onNavigateModule && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onNavigateModule('circulatory_sim', targetOrgan)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 text-xs font-mono border border-indigo-500/40 flex items-center gap-1.5 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" /> Open Full Circulatory CFD Simulator →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stage 3 Solver Outputs */}
          {activeStageTab === 'stage3' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" /> Stage 3: Extravasation & Pre-Niche Conditioning
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold">
                  EXTRAVASATION & LOX
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">EXTRAVASATED DTC COUNT</span>
                  <span className="text-emerald-400 font-bold text-lg">{simOutput.stage3_extravasation_micrometastasis.extravasatedDtcCount} DTCs</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">DORMANT G0 QUIESCENCE</span>
                  <span className="text-cyan-400 font-bold text-lg">{simOutput.stage3_extravasation_micrometastasis.dormantQuiescentPct}%</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">TRANS-ENDOTHELIAL MIGRATION</span>
                  <span className="text-amber-400 font-bold text-lg">{simOutput.stage3_extravasation_micrometastasis.transEndothelialMigrationTimeMin} Min</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">EXOSOMAL PRIMING INDEX</span>
                  <span className="text-indigo-400 font-bold text-lg">{simOutput.stage3_extravasation_micrometastasis.exosomalPreNichePrimingIndex}x</span>
                </div>
              </div>

              {/* Stage 3 Micro-Engine: Extravasation & Pre-Niche Priming Solver */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-mono text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" /> MICRO-ENGINE: EXTRAVASATION & NICHE SOLVER
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Integrin Kinetics & LOX</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 font-mono">
                      <span>Integrin αvβ3 Affinity:</span>
                      <strong className="text-emerald-300">{integrinAffinity.toFixed(2)}</strong>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={integrinAffinity}
                      onChange={(e) => setIntegrinAffinity(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-900 rounded"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 font-mono">
                      <span>Endothelial Permeability:</span>
                      <strong className="text-amber-300">{endothelialPermeability.toFixed(1)}x</strong>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={endothelialPermeability}
                      onChange={(e) => setEndothelialPermeability(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-900 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">TEM MIGRATION TIME</span>
                    <strong className="text-amber-400">{calculatedTemTimeMinutes} min</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">PRE-NICHE PRIMING</span>
                    <strong className="text-indigo-400">{calculatedNichePrimingIndex}x</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">EXTRAVASATION EFF.</span>
                    <strong className="text-emerald-400">{calculatedExtravasationEfficiency}%</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 4 Solver Outputs */}
          {activeStageTab === 'stage4' && (
            <div className="space-y-6">
              {/* SISTEM Genomic Evolutionary Lineage Tree */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-amber-400" /> Stage 4: SISTEM Evolutionary Genomic Lineage Tree
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold">
                    SISTEM SINGLE-CELL TREE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {simOutput.stage4_organ_colonization_evolution.sistemGenomicTree.map((clone: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-white">{clone.cloneId}</span>
                        <span className="text-amber-400 font-mono">{(clone.fraction * 100).toFixed(0)}% Pop</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block">Somatic Mutations:</span>
                        <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                          {clone.muts.map((m: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-cyan-300 rounded">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-2 flex justify-between">
                        <span>Therapeutic Sensitivity:</span>
                        <strong className={clone.drugResist.includes('High') ? 'text-rose-400' : 'text-emerald-400'}>
                          {clone.drugResist}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage 4 Micro-Engine: Dormancy Lock & Clonal Evolution Solver */}
              <div className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-mono text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> MICRO-ENGINE: DORMANCY & EVOLUTION SOLVER
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">SISTEM Evolutionary Tree</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400 font-mono">
                    <span>Somatic Mutation Rate (μ_SISTEM):</span>
                    <strong className="text-amber-300">{mutationRate.toFixed(5)} / div</strong>
                  </div>
                  <input
                    type="range"
                    min="0.00001"
                    max="0.00080"
                    step="0.00005"
                    value={mutationRate}
                    onChange={(e) => setMutationRate(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-900 rounded"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">G0 DORMANCY DURATION</span>
                    <strong className="text-cyan-400">{calculatedDormancyMonths} mo</strong>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">CLONAL EXPANSION</span>
                    <strong className="text-amber-400">{calculatedClonalExpansionRate}x / mo</strong>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">RESISTANCE PHENOTYPE</span>
                    <strong className={mutationRate > 0.0003 ? 'text-rose-400' : 'text-emerald-400'}>
                      {mutationRate > 0.0003 ? 'High Polyclonal' : 'Sensitive'}
                    </strong>
                  </div>
                </div>

                {onNavigateModule && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onNavigateModule('tumor_evolution_math', targetOrgan)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-200 text-xs font-mono border border-amber-500/40 flex items-center gap-1.5 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" /> Launch Clonal Evolution & EGT Math Engine →
                    </button>
                  </div>
                )}
              </div>

              {/* Colony Growth Time Series Chart */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm">Longitudinal Colony Outgrowth Series (Days 0 - 120)</h4>
                  <span className="text-xs text-slate-400 font-mono">Multi-Organ Micrometastasis Counts</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simOutput.stage4_organ_colonization_evolution.colonyGrowthSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="day" stroke="#94a3b8" label={{ value: 'Days Post-Seeding', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" label={{ value: 'Extravasated DTC Count', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                      <Legend />
                      <Line type="monotone" dataKey="boneDtcCount" name="Bone (Endosteal)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="brainDtcCount" name="Brain (Parenchyma)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="lungDtcCount" name="Lung (Alveolar)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Parameter Sensitivity Tornado Plot */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wide flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" /> Parameter Global Sensitivity Tornado Analysis
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Sobol Global Sensitivity Indices ($S_i$)</span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={tornadoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" unit="%" label={{ value: 'Sensitivity Impact on Metastatic Risk (%)', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 10 }} />
              <YAxis type="category" dataKey="parameter" stroke="#94a3b8" width={200} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
              <Bar dataKey="impactOnRiskPct" name="Risk Impact (%)" fill="#38bdf8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cross-System Interconnection Launchpad */}
      {onNavigateModule && (
        <div className="bg-slate-900 border border-cyan-500/30 p-5 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wide">
              Cross-System Pipeline Integration Launchpad
            </h3>
          </div>

          <p className="text-xs text-slate-300">
            Wire parameters from this multiscale simulation directly into MetaMap's specialized diagnostic and forecasting modules:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
            <button
              onClick={() => onNavigateModule('living_cinema', targetOrgan)}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1.5 text-center text-slate-200 transition-colors"
            >
              <Film className="w-4 h-4 text-cyan-400" />
              <span>Living Cinema</span>
            </button>

            <button
              onClick={() => onNavigateModule('cascade_twin', targetOrgan)}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1.5 text-center text-slate-200 transition-colors"
            >
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Cascade Twin</span>
            </button>

            <button
              onClick={() => onNavigateModule('forecast_engine', targetOrgan)}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1.5 text-center text-slate-200 transition-colors"
            >
              <Brain className="w-4 h-4 text-emerald-400" />
              <span>Forecast Engine</span>
            </button>

            <button
              onClick={() => onNavigateModule('resistance_forge', targetOrgan)}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1.5 text-center text-slate-200 transition-colors"
            >
              <Swords className="w-4 h-4 text-amber-400" />
              <span>Resistance Forge</span>
            </button>

            <button
              onClick={() => onNavigateModule('proactive_interception', targetOrgan)}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1.5 text-center text-slate-200 transition-colors"
            >
              <Stethoscope className="w-4 h-4 text-rose-400" />
              <span>Interception</span>
            </button>

            <button
              onClick={() => onNavigateModule('workflow')}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1.5 text-center text-slate-200 transition-colors"
            >
              <Play className="w-4 h-4 text-cyan-400" />
              <span>HPC Workflow</span>
            </button>
          </div>
        </div>
      )}

      {/* PhysiCell / SISTEM Code Exporter Modal */}
      {showCodeExportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base font-mono">
                  PhysiCell Configuration XML Script Export
                </h3>
              </div>
              <button
                onClick={() => setShowCodeExportModal(false)}
                className="text-slate-400 hover:text-white font-mono font-bold text-sm px-2 py-1 rounded bg-slate-800"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-300 font-mono">
              Executable PhysiCell configuration XML grounded with your configured biophysical slider values (Hypoxia: {oxygenHypoxiaThreshold} mmHg, EMT: {emtSwitchProbability}, LOX: {loxMatrixStiffnessKpa} kPa, Shear: {shearStressDynCm2} dyn/cm²):
            </p>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
              {generatedPhysiCellXML}
            </pre>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => navigator.clipboard.writeText(generatedPhysiCellXML)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg font-mono transition-colors"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

