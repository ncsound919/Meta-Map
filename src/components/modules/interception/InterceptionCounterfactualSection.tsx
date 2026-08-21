import React from 'react';
import {
  BadgeCheck,
  Download,
  Award,
  Users,
  BrainCircuit,
  Sparkles,
  FlaskConical,
  ExternalLink,
  Pill,
  ShieldAlert,
  FileCheck
} from 'lucide-react';

interface InterceptionCounterfactualSectionProps {
  counterfactualData: any;
  handleDownloadBriefingReport: () => void;
  handleSimulateCounterfactual: () => void;
  baselineTherapy: string;
  setBaselineTherapy: (val: string) => void;
  hypotheticalIntervention: string;
  setHypotheticalIntervention: (val: string) => void;
  onNavigateModule?: (moduleId: string, organ?: string) => void;
  selectedOrgan: string;
}

export const InterceptionCounterfactualSection: React.FC<InterceptionCounterfactualSectionProps> = ({
  counterfactualData,
  handleDownloadBriefingReport,
  handleSimulateCounterfactual,
  baselineTherapy,
  setBaselineTherapy,
  hypotheticalIntervention,
  setHypotheticalIntervention,
  onNavigateModule,
  selectedOrgan
}) => {
  return (
    <div className="space-y-6">
      {/* Lab Accreditation & Quality Assurance Sign-Off Header */}
      {counterfactualData.labQualityAssurance && (
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white">CLIA / CAP CERTIFIED MOLECULAR TUMOR BOARD ENGINE</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  {counterfactualData.labQualityAssurance.cliaCapLabCertified}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                QC Pipeline: {counterfactualData.labQualityAssurance.qcStatus} | Pathologist: {counterfactualData.labQualityAssurance.pathologistSignOff}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadBriefingReport}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow shrink-0"
          >
            <Download className="w-3.5 h-3.5" /> Download MDT Clinical Briefing
          </button>
        </div>
      )}

      {/* AMP / ASCO / CAP Evidence-Based Biomarker Tiering System */}
      {counterfactualData.ampAscoCapTiers && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wide flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> AMP / ASCO / CAP Evidence-Based Biomarker Tiering Matrix
            </h4>
            <span className="text-[10px] font-mono text-slate-400">ISO 15189 STANDARDIZED CLASSIFICATION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {counterfactualData.ampAscoCapTiers.map((tierItem: any, idx: number) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs space-y-2 font-mono ${
                  tierItem.tier.includes('Tier I')
                    ? 'bg-amber-950/30 border-amber-500/50'
                    : tierItem.tier.includes('Tier II')
                    ? 'bg-indigo-950/30 border-indigo-500/50'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    tierItem.tier.includes('Tier I') ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tierItem.tier.split(':')[0]}
                  </span>
                  <span className="text-cyan-400 font-bold">{tierItem.vafPct}% VAF</span>
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{tierItem.gene}</div>
                  <div className="text-[10px] text-slate-400">{tierItem.level}</div>
                </div>
                <p className="text-[10px] text-slate-300 leading-snug pt-1 border-t border-slate-800/80">
                  {tierItem.therapeuticImplication}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multidisciplinary Tumor Board (MDT) Consortium Specialist Voting Simulation */}
      {counterfactualData.mdtConsensusPanel && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Multidisciplinary Tumor Board Consortium Consensus
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated consensus voting across multi-institutional medical oncology, molecular pathology, and computational biology specialists.
              </p>
            </div>

            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-slate-400 font-mono font-bold">CONSENSUS SCORE:</span>
              <span className="text-emerald-400 font-extrabold text-sm font-mono">
                {counterfactualData.mdtConsensusPanel.consensusScorePct}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {counterfactualData.mdtConsensusPanel.specialists.map((spec: any, sIdx: number) => (
              <div key={sIdx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-indigo-300 font-bold">{spec.discipline}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    spec.vote.includes('Strongly') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {spec.vote}
                  </span>
                </div>
                <div className="font-bold text-white">{spec.specialistName}</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{spec.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Counterfactual Scenario Controls */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-white text-sm">Molecular Tumor Board "What-If" Counterfactual Simulator</h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
            DO-CALCULUS SCM
          </span>
        </div>

        {/* Scenario Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-slate-400 font-bold block">PRESET COUNTERFACTUAL SCENARIOS:</span>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {[
              'Switch to Adjuvant Targeted TKI + Bisphosphonate Priming',
              'Add Elacestrant SERD + Erdafitinib FGFR1 Inhibitor',
              'Combine Anti-CXCR4 Nanobody + Checkpoint Immunotherapy',
              'Standard Adjuvant Chemotherapy Only'
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setHypotheticalIntervention(preset);
                }}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  hypotheticalIntervention === preset
                    ? 'bg-amber-600 border-amber-400 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="block text-slate-400 font-mono mb-1 font-bold">Baseline Treatment Strategy:</label>
            <input
              type="text"
              value={baselineTherapy}
              onChange={(e) => setBaselineTherapy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1 font-bold">Hypothetical Counterfactual Intervention:</label>
            <input
              type="text"
              value={hypotheticalIntervention}
              onChange={(e) => setHypotheticalIntervention(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center pt-2 gap-3">
          {onNavigateModule && (
            <button
              onClick={() => onNavigateModule('causal_oracle', selectedOrgan)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <BrainCircuit className="w-4 h-4 text-cyan-400" /> Interrogate in Judea Pearl Causal Oracle
            </button>
          )}

          <button
            onClick={handleSimulateCounterfactual}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4" /> Run Counterfactual Simulation
          </button>
        </div>
      </div>

      {/* Predictive Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[10px] font-mono block font-bold">BASELINE 3-YR CNS MET RISK</span>
          <span className="text-xl font-extrabold text-rose-400">{counterfactualData.predictiveImpact.threeYearCnsMetastasisProbabilityBaselinePct}%</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[10px] font-mono block font-bold">INTERVENTION 3-YR RISK</span>
          <span className="text-xl font-extrabold text-emerald-400">{counterfactualData.predictiveImpact.threeYearCnsMetastasisProbabilityInterventionPct}%</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[10px] font-mono block font-bold">ABSOLUTE RISK REDUCTION</span>
          <span className="text-xl font-extrabold text-amber-400">-{counterfactualData.predictiveImpact.absoluteRiskReductionPct}% ARR</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[10px] font-mono block font-bold">MEDIAN PFS EXTENSION</span>
          <span className="text-xl font-extrabold text-cyan-400">+{counterfactualData.predictiveImpact.medianProgressionFreeSurvivalMonthsIntervention - counterfactualData.predictiveImpact.medianProgressionFreeSurvivalMonthsBaseline} Mo</span>
        </div>
      </div>

      {/* Real-time Matched Clinical Trials & Toxicity Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matched Clinical Trials */}
        {counterfactualData.matchedClinicalTrials && (
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-cyan-400" /> Active NCT Matched Clinical Trials
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">
                CLINICALTRIALS.GOV API
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {counterfactualData.matchedClinicalTrials.map((trial: any, tIdx: number) => (
                <div key={tIdx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <a
                      href={`https://clinicaltrials.gov/study/${trial.nctId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {trial.nctId} <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-emerald-400 font-bold">{trial.matchScorePct}% Biomarker Match</span>
                  </div>
                  <div className="font-bold text-white font-sans text-xs">{trial.title}</div>
                  <div className="text-[10px] text-slate-400 flex flex-wrap justify-between gap-1 pt-1 border-t border-slate-800/80">
                    <span>Phase: <strong className="text-slate-200">{trial.phase}</strong></span>
                    <span>Status: <strong className="text-emerald-300">{trial.recruitmentStatus}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Therapeutic Toxicity & Combination Safety Guardrails */}
        {counterfactualData.regimenSafetyAndToxicity && (
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Pill className="w-4 h-4 text-rose-400" /> Regimen Safety &amp; Toxicity Guardrail Index
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-bold">
                SAFETY SCORE: {counterfactualData.regimenSafetyAndToxicity.safetyIndexScorePct}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono">
                <span className="text-[10px] text-slate-400 font-bold block">GRADE 3/4 ADVERSE EVENT PROBABILITIES:</span>
                {counterfactualData.regimenSafetyAndToxicity.toxicityBreakdown.map((tox: any, toxIdx: number) => (
                  <div key={toxIdx} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-200">{tox.toxicityType}</span>
                      <span className="text-rose-400 font-bold">{tox.riskPct}% Risk</span>
                    </div>
                    <div className="text-[10px] text-slate-400 italic font-sans">
                      Management: {tox.managementProtocol}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{counterfactualData.regimenSafetyAndToxicity.drugDrugInteractionWarning}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Explainable SHAP Pathway Importance & Evidence Grounding */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-amber-400" /> SHAP Pathway Mechanistic Attribution
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold">EXPLAINABLE AI</span>
          </div>

          <div className="space-y-3">
            {counterfactualData.explainablePathwaysShap.map((shap: any, idx: number) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200">{shap.pathway}</span>
                  <span className="font-mono text-amber-400 font-bold">{(shap.importanceWeight * 100).toFixed(0)}% Weight</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${shap.importanceWeight * 100}%` }}></div>
                </div>
                <div className="text-[11px] text-emerald-400 font-mono font-bold">
                  Impact: {shap.impactDirection}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-400" /> Guidelines &amp; Clinical Trial Grounding
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold">NCCN / ESMO</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-indigo-400 font-bold block">Guideline Recommendation:</span>
              <p className="text-slate-200">{counterfactualData.tumorBoardEvidenceGrounding.guidelineSupport}</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-indigo-400 font-bold block">Pivotal Supporting Trials:</span>
              <div className="flex gap-2 font-mono text-[11px]">
                {counterfactualData.tumorBoardEvidenceGrounding.pivotalTrials.map((trial: string, tIdx: number) => (
                  <span key={tIdx} className="px-2 py-1 bg-slate-900 rounded border border-slate-800 text-slate-300">
                    {trial}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-indigo-400 font-bold block">Mechanistic Rationale:</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {counterfactualData.tumorBoardEvidenceGrounding.mechanisticRationale}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
