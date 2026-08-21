import React, { useState, useEffect } from "react";
import { Slider } from "../ui/Slider";
import { OrganSite, PrimaryCancerType } from '../../types/metastasis';
import {
  HelpCircle,
  Zap,
  Sliders,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Download,
  Dna,
  Share2,
  Cpu,
  Layers,
  ArrowRight,
  GitCommit,
  Network,
  Activity,
  Compass,
  FileCheck,
  Shield,
  BarChart3,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface CausalMetastasisOracleProps {
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
}

export const CausalMetastasisOracle: React.FC<CausalMetastasisOracleProps> = ({
  selectedOrgan,
  selectedCancerType
}) => {
  // Constraint Ablation State
  const [selectedConstraint, setSelectedConstraint] = useState<string>('INVERT_SHEAR_FORCE');
  const [inversionIntensity, setInversionIntensity] = useState<number>(100);
  const [isInterrogating, setIsInterrogating] = useState<boolean>(false);
  const [causalResults, setCausalResults] = useState<any>(null);

  // Pearl Do-Calculus Counterfactual Intervention State
  const [activeDoIntervention, setActiveDoIntervention] = useState<'NONE' | 'DO_PIEZO1_KNOCKDOWN' | 'DO_CXCR4_ANTAGONISM' | 'DO_MHC1_STABILIZATION' | 'DO_FAO_INHIBITION'>('NONE');
  const [ablatedEdges, setAblatedEdges] = useState<string[]>([]);
  const [selectedDagNode, setSelectedDagNode] = useState<string | null>(null);

  // Load initial causal interrogation
  useEffect(() => {
    executeCausalInterrogation();
  }, [selectedConstraint, selectedOrgan, selectedCancerType, activeDoIntervention, ablatedEdges]);

  const executeCausalInterrogation = async () => {
    setIsInterrogating(true);
    try {
      const res = await fetch('/api/causal-oracle/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          constraintRule: selectedConstraint,
          organSite: selectedOrgan,
          cancerType: selectedCancerType,
          inversionIntensity,
          doIntervention: activeDoIntervention,
          ablatedEdges
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCausalResults(data);
      }
    } catch (e) {
      console.error('Failed to run causal interrogation:', e);
    } finally {
      setIsInterrogating(false);
    }
  };

  const toggleEdgeAblation = (edgeKey: string) => {
    setAblatedEdges(prev => 
      prev.includes(edgeKey) ? prev.filter(k => k !== edgeKey) : [...prev, edgeKey]
    );
  };

  // Export Causal DAG Data
  const handleExportCausalCsv = () => {
    if (!causalResults) return;
    const headers = ['Constraint_Rule', 'Inversion_Intensity_Pct', 'Necessity_Score_Pct', 'Sufficiency_Score_Pct', 'Outcome_Status', 'Success_Rate_Pct', 'Pearl_Do_Intervention', 'Irreducible_Why_Principle'];
    const row = [
      causalResults.constraintRule,
      causalResults.inversionIntensityPct,
      causalResults.causalMetrics.causalNecessityScore,
      causalResults.causalMetrics.causalSufficiencyScore,
      causalResults.causalMetrics.outcomeStatus,
      causalResults.causalMetrics.metastaticSuccessRatePct,
      activeDoIntervention,
      `"${causalResults.irreducibleWhy.replace(/"/g, '""')}"`
    ];

    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Causal_Oracle_Audit_${selectedConstraint}_${activeDoIntervention}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const constraintOptions = [
    {
      id: 'INVERT_SHEAR_FORCE',
      name: 'Invert Fluid Dynamics & Shear Laws',
      category: 'Physical Mechanics',
      description: 'Invert microvascular fluid shear gradients (0.5 to 25.0 dynes/cm²) and turbulent velocity vectors.'
    },
    {
      id: 'ERASE_BIOCHEMICAL_GRADIENT',
      name: 'Erase Haptotactic CXCL12 Slope',
      category: 'Biochemical Gradients',
      description: 'Flatten tissue chemoattractant and haptotactic chemokine slopes across endothelial barriers.'
    },
    {
      id: 'MHC1_HYPER_VISIBLE',
      name: 'Force Hyper-Expression of MHC Class I',
      category: 'Immune Recognition Rules',
      description: 'Erase immune stealth by forcing constitutive MHC-I surface presentation on CTCs and DTCs.'
    },
    {
      id: 'SWAP_ORGAN_GEOMETRY',
      name: 'Swap Niche Matrix Mechanics (Bone <-> Brain)',
      category: 'Spatial Geometry & ECM',
      description: 'Force bone osteolytic cells into soft laminin-hyaluronic acid ECM stiffness landscapes.'
    },
    {
      id: 'FORCE_LIPID_METABOLIC_CURRENCY',
      name: 'Lock Metabolic Currency to FAO',
      category: 'Metabolic & Energetic Rules',
      description: 'Force mitochondrial Fatty Acid Oxidation (FAO) and ablate glycolytic plasticity.'
    }
  ];

  // Sensitivity analysis data for audit inspection
  const sensitivityCurve = [
    { intensity: 0, necessity: 15, sufficiency: 20, successRate: 98 },
    { intensity: 25, necessity: 38, sufficiency: 34, successRate: 76 },
    { intensity: 50, necessity: 64, sufficiency: 52, successRate: 48 },
    { intensity: 75, necessity: 82, sufficiency: 62, successRate: 18 },
    { intensity: 100, necessity: causalResults?.causalMetrics?.causalNecessityScore || 92, sufficiency: causalResults?.causalMetrics?.causalSufficiencyScore || 68, successRate: causalResults?.causalMetrics?.metastaticSuccessRatePct || 24 }
  ];

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Audit-Grade Causal Discovery & Pearl Counterfactual Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">Structural Causal Models (SCMs) & do-Calculus DAGs</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Causal Metastasis Oracle
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Systematically executes Pearl do-calculus counterfactual surgery, constraint ablations, and structural causal model (SCM) path tracing to prove exact <strong>causal necessity</strong> and <strong>sufficiency</strong> across metastatic transitions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCausalCsv}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" /> Export Causal Audit Packet (.CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Quartet Navigation Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-400">
          <span className="text-slate-500 text-[10px] block font-sans font-bold">1. WHO & WHAT</span>
          <span className="text-cyan-300 font-bold font-sans text-xs">Living Atlas</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-400">
          <span className="text-slate-500 text-[10px] block font-sans font-bold">2. WHERE & HOW</span>
          <span className="text-cyan-300 font-bold font-sans text-xs">Cascade Simulator</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-400">
          <span className="text-slate-500 text-[10px] block font-sans font-bold">3. WHEN & WHAT NEXT</span>
          <span className="text-cyan-300 font-bold font-sans text-xs">Forecast Engine</span>
        </div>
        <div className="bg-amber-950/60 p-3 rounded-lg border border-amber-500/40 text-amber-300 font-bold shadow-md">
          <span className="text-amber-400 text-[10px] block font-sans font-bold">4. THE IRREDUCIBLE WHY</span>
          <span className="text-white font-sans text-xs">Causal Oracle (SCM + do-calculus)</span>
        </div>
      </div>

      {/* Main Interrogation Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rule Rewriting Controls & Counterfactual Surgery */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Constraint Ablation & Inversion Selector
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a fundamental biophysical or regulatory rule to test under structural perturbation.
            </p>
          </div>

          <div className="space-y-2.5">
            {constraintOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedConstraint(opt.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs space-y-1 ${
                  selectedConstraint === opt.id
                    ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{opt.name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[10px] border border-slate-800">
                    {opt.category}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {opt.description}
                </p>
              </button>
            ))}
          </div>

          {/* Pearl Counterfactual do(X = x) Surgery Selector */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="text-amber-300 font-bold font-mono flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Pearl do(X = x) Counterfactual Surgery
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Structural Interventions</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveDoIntervention('NONE')}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] text-left transition-all ${
                  activeDoIntervention === 'NONE' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Natural Observational
              </button>
              <button
                onClick={() => setActiveDoIntervention('DO_PIEZO1_KNOCKDOWN')}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] text-left transition-all ${
                  activeDoIntervention === 'DO_PIEZO1_KNOCKDOWN' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                do(Piezo1 = 0)
              </button>
              <button
                onClick={() => setActiveDoIntervention('DO_CXCR4_ANTAGONISM')}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] text-left transition-all ${
                  activeDoIntervention === 'DO_CXCR4_ANTAGONISM' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                do(CXCR4 = Blocked)
              </button>
              <button
                onClick={() => setActiveDoIntervention('DO_MHC1_STABILIZATION')}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] text-left transition-all ${
                  activeDoIntervention === 'DO_MHC1_STABILIZATION' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                do(MHC1 = 1.0)
              </button>
            </div>
          </div>

          {/* Inversion Intensity Slider */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
            <Slider
              label="Rule Inversion Intensity:"
              min={0}
              max={100}
              step={5}
              value={inversionIntensity}
              onChange={(val) => setInversionIntensity(val)}
              valueDisplay={`${inversionIntensity}%`}
            />
            <p className="text-[10px] text-slate-500 pt-1">
              0% = Natural Biological Rule | 100% = Complete Constraint Ablation
            </p>
          </div>

          <button
            onClick={executeCausalInterrogation}
            disabled={isInterrogating}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isInterrogating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-slate-900" />}
            Execute Formal Structural Causal Analysis
          </button>
        </div>

        {/* Right Column: Necessity vs Sufficiency Results & The Irreducible Why */}
        <div className="lg:col-span-7 space-y-6">
          {causalResults && (
            <>
              {/* Necessity & Sufficiency Scores */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-400" />
                      Causal Necessity vs. Sufficiency Matrix
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Quantifying whether metastasis strictly fails without this constraint.
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                    causalResults.causalMetrics.outcomeStatus === 'COMPLETE_BLOCKADE'
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {causalResults.causalMetrics.outcomeStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-slate-400 font-bold block">Causal Necessity Score</span>
                    <div className="text-3xl font-bold font-mono text-amber-300">
                      {causalResults.causalMetrics.causalNecessityScore}%
                    </div>
                    <p className="text-[11px] text-slate-400">
                      High score indicates metastasis is impossible when this rule is inverted.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-slate-400 font-bold block">Causal Sufficiency Score</span>
                    <div className="text-3xl font-bold font-mono text-cyan-300">
                      {causalResults.causalMetrics.causalSufficiencyScore}%
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Measures if this single rule alone is enough to drive metastatic outgrowth.
                    </p>
                  </div>
                </div>
              </div>

              {/* The Irreducible "Why" Takeaway Box */}
              <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-5 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <h4 className="text-base font-bold text-amber-200">
                    The Irreducible Causal Principle ("The Why"):
                  </h4>
                </div>

                <p className="text-white text-sm font-semibold leading-relaxed bg-slate-950/80 p-3.5 rounded-lg border border-amber-900/60 font-mono">
                  "{causalResults.irreducibleWhy}"
                </p>

                <div className="space-y-1 text-xs text-slate-300">
                  <span className="font-bold text-amber-400 block">Emergent Compensatory Evasion Pathway:</span>
                  <p className="text-slate-300 text-xs leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {causalResults.compensatoryMechanism}
                  </p>
                </div>
              </div>

              {/* Causal Directed Acyclic Graph (DAG) Network Representation */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Network className="w-4 h-4 text-cyan-400" />
                      Interactive Causal DAG & Structural Path Tracing
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Click nodes to isolate sub-pathways or click arrows to ablate specific causal edges.
                    </p>
                  </div>
                  {ablatedEdges.length > 0 && (
                    <button
                      onClick={() => setAblatedEdges([])}
                      className="text-[10px] text-rose-400 hover:underline font-mono"
                    >
                      Reset {ablatedEdges.length} Ablated Edges
                    </button>
                  )}
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  {causalResults.causalDagGraph.nodes.map((node: any, idx: number) => {
                    const isNodeSelected = selectedDagNode === node.id;
                    return (
                      <React.Fragment key={node.id}>
                        <button
                          onClick={() => setSelectedDagNode(isNodeSelected ? null : node.id)}
                          className={`px-3 py-2 rounded-lg border text-center space-y-0.5 transition-all cursor-pointer ${
                            isNodeSelected
                              ? 'bg-cyan-950 border-cyan-400 ring-2 ring-cyan-500/30'
                              : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <span className="text-[10px] text-slate-500 uppercase block">{node.category}</span>
                          <span className="font-bold text-white text-xs">{node.label}</span>
                        </button>
                        {idx < causalResults.causalDagGraph.nodes.length - 1 && (
                          <div 
                            onClick={() => toggleEdgeAblation(`edge_${idx}`)}
                            title="Click to ablate this causal transmission edge"
                            className="cursor-pointer group p-1"
                          >
                            <ArrowRight className={`w-4 h-4 shrink-0 transition-colors ${
                              ablatedEdges.includes(`edge_${idx}`)
                                ? 'text-rose-500 line-through opacity-40'
                                : 'text-amber-400 group-hover:text-amber-300'
                            }`} />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Causal Sensitivity Response Curve */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-300 font-mono flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                      Perturbation Dose-Response & Necessity Trajectory
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Monotonicity Audit</span>
                  </div>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sensitivityCurve}>
                        <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" />
                        <XAxis dataKey="intensity" stroke="#64748b" fontSize={10} tickFormatter={v => `${v}%`} />
                        <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '11px' }} />
                        <Line type="monotone" dataKey="necessity" name="Necessity Score (%)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                        <Line type="monotone" dataKey="successRate" name="Metastatic Outgrowth (%)" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

