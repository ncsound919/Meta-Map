import React, { useState, useEffect } from 'react';
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
  Compass
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
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

  // Load initial causal interrogation
  useEffect(() => {
    executeCausalInterrogation();
  }, [selectedConstraint, selectedOrgan, selectedCancerType]);

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
          inversionIntensity
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

  // Export Causal DAG Data
  const handleExportCausalCsv = () => {
    if (!causalResults) return;
    const headers = ['Constraint_Rule', 'Inversion_Intensity_Pct', 'Necessity_Score_Pct', 'Sufficiency_Score_Pct', 'Outcome_Status', 'Success_Rate_Pct', 'Irreducible_Why_Principle'];
    const row = [
      causalResults.constraintRule,
      causalResults.inversionIntensityPct,
      causalResults.causalMetrics.causalNecessityScore,
      causalResults.causalMetrics.causalSufficiencyScore,
      causalResults.causalMetrics.outcomeStatus,
      causalResults.causalMetrics.metastaticSuccessRatePct,
      `"${causalResults.irreducibleWhy.replace(/"/g, '""')}"`
    ];

    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Causal_Oracle_Principle_${selectedConstraint}.csv`;
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
                Causal Interrogation Layer ("Why Engine")
              </span>
              <span className="text-xs text-slate-400 font-mono">4th Component of the Metastasis Quartet (Who • Where • When • Why)</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Causal Metastasis Oracle
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Systematically rewrites the fundamental physical, chemical, and evolutionary laws of metastasis to reveal irreducible causal principles — determining what is strictly <strong>necessary</strong> and <strong>sufficient</strong> for cancer dissemination.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCausalCsv}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" /> Export Causal Principles (.CSV)
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
          <span className="text-white font-sans text-xs">Causal Oracle</span>
        </div>
      </div>

      {/* Main Interrogation Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rule Rewriting Controls */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Constraint Ablation & Inversion Selector
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a fundamental rule to break or invert in the physical/virtual twin.
            </p>
          </div>

          <div className="space-y-3">
            {constraintOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedConstraint(opt.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs space-y-1 ${
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

          {/* Inversion Intensity Slider */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-bold">Rule Inversion Intensity:</label>
              <span className="font-mono text-amber-300 font-bold">{inversionIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={inversionIntensity}
              onChange={(e) => setInversionIntensity(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              0% = Natural Biological Rule | 100% = Complete Constraint Ablation
            </p>
          </div>

          <button
            onClick={executeCausalInterrogation}
            disabled={isInterrogating}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isInterrogating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-slate-900" />}
            Run Systematic Causal Interrogation
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
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Network className="w-4 h-4 text-cyan-400" />
                    Causal DAG Network Architecture
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Minimal causal graph mapping rule alteration to phenotypic outcome.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  {causalResults.causalDagGraph.nodes.map((node: any, idx: number) => (
                    <React.Fragment key={node.id}>
                      <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 text-cyan-300 text-center space-y-0.5">
                        <span className="text-[10px] text-slate-500 uppercase block">{node.category}</span>
                        <span className="font-bold text-white text-xs">{node.label}</span>
                      </div>
                      {idx < causalResults.causalDagGraph.nodes.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
