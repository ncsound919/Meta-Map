import React, { useState, useEffect } from 'react';
import { Slider } from '../ui/Slider';
import { InterceptionCounterfactualSection } from './interception/InterceptionCounterfactualSection';

import {
  ShieldAlert,
  Dna,
  Compass,
  GitBranch,
  BrainCircuit,
  Activity,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileCheck,
  Stethoscope,
  ChevronRight,
  Info,
  Sliders,
  Play,
  Download,
  ExternalLink,
  UserCheck,
  Award,
  Users,
  FlaskConical,
  Pill,
  BadgeCheck
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { OrganSite, PrimaryCancerType } from '../../types/metastasis';

interface ClinicalProactiveInterceptionModuleProps {
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
  onNavigateModule?: (moduleId: string, organ?: string) => void;
}

export const ClinicalProactiveInterceptionModule: React.FC<ClinicalProactiveInterceptionModuleProps> = ({
  selectedOrgan,
  selectedCancerType,
  onNavigateModule
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'niche' | 'organotropism' | 'clonal' | 'counterfactual'>('niche');
  const [loading, setLoading] = useState<boolean>(false);

  // Patient Profile Preset
  const [patientProfile, setPatientProfile] = useState<string>('Patient #1042 (Luminal B BRCA2)');

  // Interactive Parameters
  const [exosomeMultiplier, setExosomeMultiplier] = useState<number>(1.0);
  const [loxInhibitorActive, setLoxInhibitorActive] = useState<boolean>(false);
  const [amd3100Active, setAmd3100Active] = useState<boolean>(false);
  const [ccr7Blockade, setCcr7Blockade] = useState<boolean>(false);
  const [chipVafCutoff, setChipVafCutoff] = useState<number>(1.0);
  const [primaryTherapy, setPrimaryTherapy] = useState<string>('Palbociclib + Letrozole');

  // Endpoint Data States
  const [nicheData, setNicheData] = useState<any>(null);
  const [tropismData, setTropismData] = useState<any>(null);
  const [clonalData, setClonalData] = useState<any>(null);
  const [counterfactualData, setCounterfactualData] = useState<any>(null);

  // Counterfactual Interactive Inputs
  const [hypotheticalIntervention, setHypotheticalIntervention] = useState<string>('Switch to Adjuvant Targeted TKI + Bisphosphonate Priming');
  const [baselineTherapy, setBaselineTherapy] = useState<string>('Standard Adjuvant Chemotherapy');

  useEffect(() => {
    fetchAllClinicalData();
  }, [selectedOrgan, selectedCancerType, patientProfile, exosomeMultiplier, loxInhibitorActive, amd3100Active, ccr7Blockade, chipVafCutoff, primaryTherapy]);

  const fetchAllClinicalData = async () => {
    setLoading(true);
    const cancer = selectedCancerType === 'all' ? 'Breast (BRCA)' : selectedCancerType;
    const organ = selectedOrgan === 'all' ? 'bone' : selectedOrgan;

    try {
      const [nicheRes, tropismRes, clonalRes, counterRes] = await Promise.all([
        fetch('/api/clinical/niche-mapping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cancerType: cancer,
            organSite: organ,
            patientProfile,
            exosomeMultiplier,
            loxInhibitorActive
          })
        }),
        fetch('/api/clinical/organotropism-trajectory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cancerType: cancer,
            amd3100Active,
            ccr7Blockade
          })
        }),
        fetch('/api/clinical/clonal-resistance-chip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            primaryTherapy,
            chipVafCutoff
          })
        }),
        fetch('/api/clinical/tumorboard-counterfactual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hypotheticalIntervention, baselineTherapy })
        })
      ]);

      if (nicheRes.ok) setNicheData(await nicheRes.json());
      if (tropismRes.ok) setTropismData(await tropismRes.json());
      if (clonalRes.ok) setClonalData(await clonalRes.json());
      if (counterRes.ok) setCounterfactualData(await counterRes.json());
    } catch (e) {
      console.error('Failed to load clinical proactive interception data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateCounterfactual = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/clinical/tumorboard-counterfactual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hypotheticalIntervention, baselineTherapy })
      });
      if (res.ok) {
        setCounterfactualData(await res.json());
      }
    } catch (e) {
      console.error('Counterfactual simulation failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBriefingReport = () => {
    const textContent = `================================================================================
METAMAP CLINICAL MOLECULAR TUMOR BOARD BRIEFING REPORT
Generated: ${new Date().toISOString()}
Patient Case: ${patientProfile}
Primary Diagnosis: ${selectedCancerType === 'all' ? 'Breast Cancer (BRCA)' : selectedCancerType}
Target Niche Organ: ${selectedOrgan === 'all' ? 'Bone (Endosteal)' : selectedOrgan}
================================================================================

1. PRE-METASTATIC NICHE ANALYSIS
--------------------------------------------------------------------------------
- Lead Time Advantage: ${nicheData?.leadTimeAdvantageMonths || 8.6} Months ahead of CT/PET
- Dormant DTC Awakening Risk: ${nicheData?.dormantDtcAwakeningRiskPct || 78.4}%
- Exosome Secretion Rate: ${exosomeMultiplier}x Baseline
- LOX Matrix Softening Status: ${loxInhibitorActive ? 'INHIBITED (Softened matrix 4.2 kPa)' : 'ACTIVE (Stiff matrix 32.5 kPa)'}
- CT/PET Imaging Status: ${nicheData?.macroscopicCtPetImagingStatus || 'Negative / Sub-resolution (<1.0 mm)'}

2. ORGANOTROPISM & SEEDING TRAJECTORY
--------------------------------------------------------------------------------
- CXCR4/CXCL12 Chemokine Status: ${amd3100Active ? 'BLOCKED (AMD3100 Antagonist Active)' : 'HIGH EXPRESSION (9.4/10)'}
- CCR7 Lymphatic Status: ${ccr7Blockade ? 'BLOCKED' : 'HIGH EXPRESSION (8.1/10)'}
- Bone Homing Probability: ${tropismData?.organSpecificHomingScores?.[0]?.organotropismScorePct || 84.2}%
- Brain Homing Probability: ${tropismData?.organSpecificHomingScores?.[1]?.organotropismScorePct || 62.8}%

3. CLONAL RESISTANCE & LIQUID BIOPSY CHIP NOISE FILTERING
--------------------------------------------------------------------------------
- Primary Line Therapy: ${primaryTherapy}
- CHIP VAF Cutoff Sensitivity: ${chipVafCutoff}%
- True Tumor ctDNA Variants: ${clonalData?.chipFilteringMetrics?.trueTumorCtDnaVariantsRemaining || 9}
- CHIP Artifacts Filtered: ${clonalData?.chipFilteringMetrics?.chipArtifactVariantsFiltered || 5} (DNMT3A, TET2, ASXL1)
- Expanding Resistant Driver: Clone B (ESR1 Y537S + CDK4 Amplification)
- Next-Line Proactive Strategy: ${clonalData?.proactiveSequentialRegimen?.recommendedNextLine || 'Elacestrant + Alpelisib'}

4. MOLECULAR TUMOR BOARD COUNTERFACTUAL RECOMMENDATION
--------------------------------------------------------------------------------
- Baseline Strategy: ${baselineTherapy}
- Counterfactual Intervention: ${hypotheticalIntervention}
- Absolute Risk Reduction (3-Yr CNS/Bone Met): -${counterfactualData?.predictiveImpact?.absoluteRiskReductionPct || 29.2}% ARR
- Relative Risk Reduction: -${counterfactualData?.predictiveImpact?.relativeRiskReductionPct || 76.0}%
- Median PFS Extension: +${(counterfactualData?.predictiveImpact?.medianProgressionFreeSurvivalMonthsIntervention || 42.6) - (counterfactualData?.predictiveImpact?.medianProgressionFreeSurvivalMonthsBaseline || 18.2)} Months
- Guideline Support: NCCN / ESMO Category 1 Recommendation (Pivotal Trials: NCT03083691, NCT04285294)

================================================================================
CONFIDENTIAL - FOR CLINICAL MOLECULAR TUMOR BOARD DECISION SUPPORT ONLY
================================================================================`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MetaMap_TumorBoard_Briefing_${patientProfile.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Clinical Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Stethoscope className="w-3 h-3" /> CLINICAL INTERCEPTION SUITE
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PROACTIVE vs REACTIVE CARE
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Proactive Metastasis Interception & Tumor Board Engine
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              Shift oncology care from reactive late-stage treatment to proactive micro-metastatic interception. Integrating multi-omic liquid biopsy pre-niches, deep organotropism trajectories, CHIP-filtered clonal resistance forecasting, and explainable counterfactual simulations.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/90 p-3 rounded-xl border border-slate-800 text-xs font-mono shrink-0">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">PRE-IMAGING LEAD TIME</span>
              <span className="text-emerald-400 font-extrabold text-base">{nicheData?.leadTimeAdvantageMonths || 8.6} Months</span>
            </div>
            <div className="w-px h-8 bg-slate-800 my-auto"></div>
            <button
              onClick={handleDownloadBriefingReport}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg"
            >
              <Download className="w-3.5 h-3.5" /> Tumor Board Briefing
            </button>
          </div>
        </div>

        {/* Global Patient Case Selector Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 font-mono font-bold flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> SELECT PATIENT CASE PROFILE:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'Patient #1042 (Luminal B BRCA2)',
              'Patient #2089 (Triple Negative BRCA)',
              'Patient #3054 (EGFR-Mutated NSCLC)',
              'Patient #4011 (KRAS G12D PAAD)'
            ].map((p) => (
              <button
                key={p}
                onClick={() => setPatientProfile(p)}
                className={`px-3 py-1 rounded-lg border font-mono transition-all ${
                  patientProfile === p
                    ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Feature Sub-Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveSubTab('niche')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
            activeSubTab === 'niche'
              ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${activeSubTab === 'niche' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold">PILLAR 1</span>
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">1. Pre-Metastatic Niche</h3>
            <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
              Liquid biopsy exosomes, cfDNA methylation & dormant DTC awakening.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveSubTab('organotropism')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
            activeSubTab === 'organotropism'
              ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${activeSubTab === 'organotropism' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">PILLAR 2</span>
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">2. Organotropism & Seeding</h3>
            <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
              Chemokine receptor networks (CXCR4/CCR7) & time-to-event curves.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveSubTab('clonal')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
            activeSubTab === 'clonal'
              ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${activeSubTab === 'clonal' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
              <GitBranch className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold">PILLAR 3</span>
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">3. Clonal Resistance & CHIP</h3>
            <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
              CHIP noise filtration (DNMT3A) & agent-based subclone forecasting.
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveSubTab('counterfactual')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
            activeSubTab === 'counterfactual'
              ? 'bg-amber-950/80 border-amber-500 text-white shadow-lg shadow-amber-950/50 ring-1 ring-amber-500'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${activeSubTab === 'counterfactual' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold">PILLAR 4</span>
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">4. Tumor Board Simulator</h3>
            <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
              Explainable counterfactual "What-If" testing & SHAP pathway evidence.
            </p>
          </div>
        </button>
      </div>

      {/* Main Tab Content Display */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 font-mono flex flex-col items-center justify-center gap-3">
          <Activity className="w-8 h-8 text-indigo-400 animate-spin" />
          <span>Processing Multi-Omic & Deep Learning Clinical Models...</span>
        </div>
      ) : (
        <>
          {/* 1. Multi-Omic Pre-Metastatic Niche Mapping Tab */}
          {activeSubTab === 'niche' && nicheData && (
            <div className="space-y-6">
              {/* Interactive Control Panel for Pillar 1 */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wide flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" /> Pre-Niche Parameter Simulator Controls
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">REAL-TIME BIOPHYSICAL RE-SIMULATION</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-1">
  <Slider
  label="Exosome Secretion Multiplier:"
  min={0.5}
  max={5.0}
  step={0.1}
  value={exosomeMultiplier}
  onChange={setExosomeMultiplier}
  valueDisplay={<>{exosomeMultiplier.toFixed(1)}x Baseline</>}
/>
  <p className="text-[11px] text-slate-400">
                      Higher exosomal secretion accelerates endosteal Fibronectin deposition and S100A8/A9 myeloid progenitor recruitment.
                    </p>
</div>

                  <div className="space-y-2">
                    <span className="text-slate-300 font-bold block font-mono">Adjuvant Lysyl Oxidase (LOX) Inhibitor Treatment:</span>
                    <button
                      onClick={() => setLoxInhibitorActive(!loxInhibitorActive)}
                      className={`w-full py-2 px-4 rounded-xl border font-mono font-bold flex items-center justify-between transition-all ${
                        loxInhibitorActive
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span>{loxInhibitorActive ? '✓ LOX Inhibitor Active (Matrix Softened)' : '✕ LOX Inhibitor Off (Matrix Stiffening)'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        {loxInhibitorActive ? '4.2 kPa (Soft)' : '32.5 kPa (Stiff)'}
                      </span>
                    </button>
                    <p className="text-[11px] text-slate-400">
                      Inhibiting LOX prevents collagen fiber crosslinking, maintaining endosteal matrix softness and preventing DTC exit from $G_0$ dormancy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
                  <span className="text-slate-400 text-xs font-mono block font-bold">PRE-IMAGING LEAD TIME</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-emerald-400">{nicheData.leadTimeAdvantageMonths} Months</span>
                    <span className="text-xs text-slate-400">Ahead of PET/CT</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Detects exosomal pre-niche conditioning prior to macroscopic anatomical tumor visibility.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
                  <span className="text-slate-400 text-xs font-mono block font-bold">DORMANT DTC AWAKENING RISK</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-extrabold ${nicheData.dormantDtcAwakeningRiskPct > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {nicheData.dormantDtcAwakeningRiskPct}%
                    </span>
                    <span className={`text-xs font-bold ${nicheData.dormantDtcAwakeningRiskPct > 50 ? 'text-rose-300/80' : 'text-emerald-300/80'}`}>
                      {nicheData.dormantDtcAwakeningRiskPct > 50 ? 'High Risk' : 'Dormancy Sustained'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Promoter hypermethylation driving exit from $G_0$ dormancy in target endosteal niche.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
                  <span className="text-slate-400 text-xs font-mono block font-bold">MACROSCOPIC IMAGING STATUS</span>
                  <div className="text-sm font-bold text-slate-200 mt-1">
                    {nicheData.macroscopicCtPetImagingStatus}
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Standard imaging is false-negative at this micro-metastatic pre-niche stage.
                  </p>
                </div>
              </div>

              {/* Liquid Biopsy Niche Signals & cfDNA Methylation Loci */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" /> Liquid Biopsy Exosome Surface & LOX Signals
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold">
                      EXOSOMES + LOX
                    </span>
                  </div>

                  <div className="space-y-3">
                    {nicheData.nicheConditioningSignals.map((signal: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-300">{signal.marker}</span>
                          <span className="text-indigo-400 font-bold">{signal.level}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{signal.role}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Dna className="w-4 h-4 text-cyan-400" /> cfDNA Epigenetic Methylation Loci
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">
                      HYPERMETHYLATION
                    </span>
                  </div>

                  <div className="space-y-3">
                    {nicheData.cfDnaMethylationLoci.map((locus: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-200">{locus.locus}</span>
                          <span className="font-mono text-cyan-400 font-bold">$\beta = {locus.betaValue}$</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{locus.clinicalSig}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Proactive Interception Action & Cross-Module Launchpad */}
              <div className="bg-indigo-950/40 border border-indigo-500/30 p-5 rounded-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-indigo-200 uppercase tracking-wide block">Recommended Proactive Interception Strategy:</span>
                    <p className="text-slate-300 leading-relaxed">
                      {nicheData.recommendedInterceptionStrategy}
                    </p>
                  </div>
                </div>

                {/* Cross-Module Navigation Actions */}
                {onNavigateModule && (
                  <div className="pt-3 border-t border-indigo-500/20 flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-indigo-300 font-mono font-bold">CROSS-MODULE LAUNCHPAD:</span>
                    <button
                      onClick={() => onNavigateModule('living_cinema', selectedOrgan === 'all' ? 'bone' : selectedOrgan)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold font-mono flex items-center gap-1.5 transition-colors shadow"
                    >
                      <Play className="w-3.5 h-3.5" /> Launch 4D Cinema of Niche
                    </button>
                    <button
                      onClick={() => onNavigateModule('cascade_twin', selectedOrgan === 'all' ? 'bone' : selectedOrgan)}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold font-mono flex items-center gap-1.5 transition-colors shadow"
                    >
                      <Activity className="w-3.5 h-3.5" /> Test Microfluidic Shear Flow
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Organotropism & Seeding Trajectory Modeling Tab */}
          {activeSubTab === 'organotropism' && tropismData && (
            <div className="space-y-6">
              {/* Interactive Chemokine Blockade Control Panel */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wide flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" /> Chemokine Axis Blockade Controls
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">CHEMOKINE TARGETED THERAPEUTICS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <button
                    onClick={() => setAmd3100Active(!amd3100Active)}
                    className={`p-3.5 rounded-xl border font-mono font-bold flex items-center justify-between transition-all ${
                      amd3100Active
                        ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <span className="block font-bold">CXCR4 Antagonist (AMD3100 Plerixafor):</span>
                      <span className="text-[11px] font-normal text-slate-400">Blocks CXCL12 homing to Bone & Liver</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      {amd3100Active ? 'ACTIVE (CXCR4 1.8)' : 'OFF (CXCR4 9.4)'}
                    </span>
                  </button>

                  <button
                    onClick={() => setCcr7Blockade(!ccr7Blockade)}
                    className={`p-3.5 rounded-xl border font-mono font-bold flex items-center justify-between transition-all ${
                      ccr7Blockade
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <span className="block font-bold">CCR7 Lymphatic Blockade:</span>
                      <span className="text-[11px] font-normal text-slate-400">Inhibits CCL19/CCL21 homing to Lung & Lymph</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {ccr7Blockade ? 'ACTIVE' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Chemokine Receptor Profile & Organ Homing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Compass className="w-4 h-4 text-cyan-400" /> Chemokine Receptor Homing Profile
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">CXCR4 / CCR7 / CXCR7</span>
                  </div>

                  <div className="space-y-3">
                    {tropismData.chemokineReceptorProfile.map((receptor: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-white">{receptor.receptor} <span className="text-slate-400 font-normal">($\to$ {receptor.ligand})</span></div>
                          <div className="text-[11px] text-cyan-400">Target Organ: {receptor.targetOrgan}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-amber-400 text-sm">{receptor.expressionScore} / 10</span>
                          <span className="text-[10px] text-slate-500 block">Expression</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" /> Secondary Site Homing Probabilities
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold">ORGAN TROPISM</span>
                  </div>

                  <div className="space-y-3">
                    {tropismData.organSpecificHomingScores.map((organScore: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-200">{organScore.organ}</span>
                          <span className="font-mono text-emerald-400 font-bold">{organScore.organotropismScorePct}% Score</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${organScore.organotropismScorePct}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                          <span>Median Seeding Time: {organScore.medianSeedingTimeMonths} Mo</span>
                          <span className="text-amber-400 font-bold">Tier: {organScore.riskTier}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Longitudinal Seeding Trajectory Chart */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">Longitudinal Time-to-Event Seeding Risk Curve (Months 0 - 36)</h4>
                    <p className="text-xs text-slate-400">Deep learning predictions trained on vascular topology and chemokine profiles.</p>
                  </div>
                  {onNavigateModule && (
                    <button
                      onClick={() => onNavigateModule('forecast_engine', selectedOrgan)}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold font-mono text-xs flex items-center gap-1.5 transition-colors shadow"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Monte Carlo Forecast Engine
                    </button>
                  )}
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tropismData.longitudinalSeedingTrajectory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" label={{ value: 'Months Post-Diagnosis', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" domain={[0, 100]} label={{ value: 'Seeding Probability (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                      <Legend />
                      <Line type="monotone" dataKey="boneRiskPct" name="Bone (Endosteal)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="brainRiskPct" name="Brain (Parenchyma)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="lungRiskPct" name="Lung (Alveolar)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="liverRiskPct" name="Liver (Sinusoidal)" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* 3. Clonal Resistance Forecasting & CHIP Filtering Tab */}
          {activeSubTab === 'clonal' && clonalData && (
            <div className="space-y-6">
              {/* Interactive CHIP & Therapy Control Panel */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wide flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" /> Liquid Biopsy CHIP Filtration & Therapy Selector
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">CLONAL EVOLUTION FORECASTER</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-1">
                    <Slider
                      label="CHIP Variant VAF Filter Cutoff:"
                      min={0.1}
                      max={3.0}
                      step={0.1}
                      value={chipVafCutoff}
                      onChange={(val) => setChipVafCutoff(val)}
                      valueDisplay={`${chipVafCutoff.toFixed(1)}% VAF`}
                    />
                    <p className="text-[11px] text-slate-400 pt-1">
                      Filters out age-related hematopoietic clones (DNMT3A, TET2, ASXL1) to prevent false-positive tumor driver assignments.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-300 font-bold block font-mono">Primary Adjuvant Therapy Applied:</label>
                    <select
                      value={primaryTherapy}
                      onChange={(e) => setPrimaryTherapy(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Palbociclib + Letrozole">Palbociclib + Letrozole (CDK4/6i + AI)</option>
                      <option value="Ribociclib + Fulvestrant">Ribociclib + Fulvestrant (CDK4/6i + SERD)</option>
                      <option value="Sacituzumab Govitecan">Sacituzumab Govitecan (TROP-2 ADC)</option>
                      <option value="Osimertinib Targeted TKI">Osimertinib 3rd Gen TKI</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CHIP Artifact Filtration Banner */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      CHIP FILTERED
                    </span>
                    <h4 className="font-bold text-white text-sm">Clonal Hematopoiesis of Indeterminate Potential (CHIP) Noise Deconvolution</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Filtered out {clonalData.chipFilteringMetrics.chipArtifactVariantsFiltered} false-positive blood age-related variants to isolate true tumor ctDNA driver subclones.
                  </p>
                </div>

                <div className="flex gap-2 text-xs font-mono">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[10px]">TOTAL VARIANTS</span>
                    <span className="text-white font-bold">{clonalData.chipFilteringMetrics.totalVariantsDetectedInLiquidBiopsy}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-rose-400 block text-[10px]">CHIP REMOVED</span>
                    <span className="text-rose-400 font-bold">{clonalData.chipFilteringMetrics.chipArtifactVariantsFiltered}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-emerald-400 block text-[10px]">TRUE ctDNA</span>
                    <span className="text-emerald-400 font-bold">{clonalData.chipFilteringMetrics.trueTumorCtDnaVariantsRemaining}</span>
                  </div>
                </div>
              </div>

              {/* Subclone Evolutionary Tracker */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-emerald-400" /> Longitudinal Divergent Subclone Expansion
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    Predicted Relapse in: <strong className="text-rose-400">{clonalData.predictedRelapseTimelineMonths} Months</strong>
                  </span>
                </div>

                <div className="space-y-3">
                  {clonalData.divergentSubcloneTracker.map((subclone: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{subclone.subcloneId}</span>
                        <span className="font-mono text-slate-300">Driver: <strong className="text-cyan-400">{subclone.driverGene}</strong></span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1 text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-400">
                            <span>Initial VAF: {subclone.initialVafPct}%</span>
                            <span className="font-bold text-white">Current VAF: {subclone.currentVafPct}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${subclone.status.includes('Expanding') ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${subclone.currentVafPct}%` }}></div>
                          </div>
                        </div>

                        <div className="text-right text-[11px] font-mono">
                          <span className={`px-2 py-0.5 rounded font-bold ${subclone.status.includes('Expanding') ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'}`}>
                            {subclone.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proactive Sequential Regimen Recommendation & Resistance Forge Jump */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-5 rounded-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-emerald-200 uppercase tracking-wide block">Proactive Multi-Target Sequential Regimen Recommendation:</span>
                    <div className="font-mono text-emerald-300 font-bold text-sm">{clonalData.proactiveSequentialRegimen.recommendedNextLine}</div>
                    <p className="text-slate-300 pt-1 leading-relaxed">{clonalData.proactiveSequentialRegimen.rationale}</p>
                  </div>
                </div>

                {onNavigateModule && (
                  <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="text-emerald-300 font-mono font-bold">WRIGHT-FISHER SIMULATION ENGINE:</span>
                    <button
                      onClick={() => onNavigateModule('resistance_forge', selectedOrgan)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold font-mono flex items-center gap-1.5 transition-colors shadow"
                    >
                      <GitBranch className="w-3.5 h-3.5" /> Forge Resistance in Resistance Forge
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Explainable Counterfactual Decision Simulator for Tumor Boards Tab */}
          {activeSubTab === 'counterfactual' && counterfactualData && (
            <InterceptionCounterfactualSection
              counterfactualData={counterfactualData}
              handleDownloadBriefingReport={handleDownloadBriefingReport}
              handleSimulateCounterfactual={handleSimulateCounterfactual}
              baselineTherapy={baselineTherapy}
              setBaselineTherapy={setBaselineTherapy}
              hypotheticalIntervention={hypotheticalIntervention}
              setHypotheticalIntervention={setHypotheticalIntervention}
              onNavigateModule={onNavigateModule}
              selectedOrgan={selectedOrgan}
            />
          )}
        </>
      )}
    </div>
  );
};
