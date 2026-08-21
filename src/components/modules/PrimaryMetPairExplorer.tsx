import React, { useState } from 'react';
import { PrimaryMetPairSample, OrganSite, PrimaryCancerType } from '../../types/metastasis';
import { Layers, ArrowRightLeft, ShieldAlert, BarChart3, Database, Activity } from 'lucide-react';

interface PrimaryMetPairExplorerProps {
  pairs: PrimaryMetPairSample[];
  selectedOrgan: OrganSite | 'all';
  selectedCancerType: PrimaryCancerType | 'all';
}

export const PrimaryMetPairExplorer: React.FC<PrimaryMetPairExplorerProps> = ({
  pairs,
  selectedOrgan,
  selectedCancerType
}) => {
  const filteredPairs = pairs.filter((p) => {
    const matchesOrgan = selectedOrgan === 'all' || p.metastaticSite === selectedOrgan;
    const matchesCancer = selectedCancerType === 'all' || p.cancerType === selectedCancerType;
    return matchesOrgan && matchesCancer;
  });

  const [activePairId, setActivePairId] = useState<string>(
    filteredPairs[0]?.pairId || pairs[0]?.pairId || ''
  );

  const activePair = pairs.find((p) => p.pairId === activePairId) || filteredPairs[0] || pairs[0];

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Matched Primary–Metastasis Pair Explorer
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side multi-omic comparative analysis between patient-matched primary lesions and secondary metastatic organ sites
          </p>
        </div>

        {/* Pair Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Select Patient Pair:</span>
          <select
            value={activePair?.pairId || ''}
            onChange={(e) => setActivePairId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          >
            {filteredPairs.map((p) => (
              <option key={p.pairId} value={p.pairId}>
                {p.patientId} ({p.cancerType.split(' ')[0]} → {p.metastaticSite.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activePair && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Sample Overview & Mutational Evolutionary Dynamics */}
          <div className="lg:col-span-5 space-y-6">
            {/* Patient Clinical Timeline & Metadata */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{activePair.patientId}</span>
                  <h3 className="font-bold text-sm text-slate-100">{activePair.cancerType}</h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold uppercase">
                  {activePair.metastaticSite} Met
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Primary Lesion</span>
                  <span className="font-medium text-slate-200">{activePair.primaryLocation}</span>
                </div>
                <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Time to Metastasis</span>
                  <span className="font-bold text-cyan-400 font-mono">{activePair.timeToMetastasisMonths} Months</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">Prior Treatment Lines:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activePair.treatmentHistory.map((rx, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {rx}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mutational Evolutionary Waterfall (Gains, Losses, Shared) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Clonal Mutational Dynamics (Primary vs Metastasis)
              </h3>

              {/* Acquired / Gained in Metastasis */}
              <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-3">
                <span className="text-xs font-bold text-amber-300 block mb-1">
                  Metastatic Specific Gains (Subclonal Outgrowth):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activePair.mutationsGain.map((m, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 font-mono border border-amber-700/50">
                      + {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Shared Ancestral */}
              <div className="bg-slate-850 border border-slate-800 rounded-lg p-3">
                <span className="text-xs font-bold text-slate-300 block mb-1">
                  Trunk Mutations (Shared Ancestral):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activePair.mutationsShared.map((m, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono border border-slate-700">
                      = {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lost in Metastasis */}
              <div className="bg-rose-950/30 border border-rose-800/40 rounded-lg p-3">
                <span className="text-xs font-bold text-rose-300 block mb-1">
                  Primary-Specific Losses:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activePair.mutationsLoss.map((m, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-rose-900/60 text-rose-200 font-mono border border-rose-700/50">
                      - {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Proteomics & Metabolomics Deltas */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-emerald-400" />
                Proteomic & XCMS Metabolomic Niche Shift
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Proteomics */}
                <div className="bg-slate-850 p-3 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-300 block mb-2 border-b border-slate-800 pb-1">
                    Phospho-Proteomics
                  </span>
                  <div className="space-y-1 font-mono text-[11px]">
                    {Object.entries(activePair.proteomicsDelta).map(([protein, val]) => {
                      const numVal = Number(val);
                      return (
                        <div key={protein} className="flex justify-between">
                          <span className="text-slate-400">{protein}:</span>
                          <span className={numVal > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {numVal > 0 ? `+${numVal}` : numVal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metabolomics */}
                <div className="bg-slate-850 p-3 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-300 block mb-2 border-b border-slate-800 pb-1">
                    Metabolomic Adaptation
                  </span>
                  <div className="space-y-1 font-mono text-[11px]">
                    {Object.entries(activePair.metabolomicsDelta).map(([met, val]) => {
                      const numVal = Number(val);
                      return (
                        <div key={met} className="flex justify-between">
                          <span className="text-slate-400 truncate max-w-[100px]">{met}:</span>
                          <span className={numVal > 0 ? 'text-cyan-400' : 'text-amber-400'}>
                            {numVal > 0 ? `+${numVal}` : numVal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Expression Log2FC, scATAC-seq Chromatin Peaks & Microenvironment */}
          <div className="lg:col-span-7 space-y-6">
            {/* Transcriptomic Delta Log2FC Bar Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Differential Expression Log2FC (Metastasis vs Primary)
                </h3>
                <span className="text-[10px] text-slate-400">DESeq2 Normalized</span>
              </div>

              <div className="space-y-2 bg-slate-850 p-3 rounded-lg border border-slate-800">
                {Object.entries(activePair.geneExpressionDeltaLog2FC).map(([gene, fc]) => {
                  const numFc = Number(fc);
                  const isUp = numFc > 0;
                  const absPct = Math.min(Math.abs(numFc) * 20, 100);
                  return (
                    <div key={gene} className="space-y-0.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-mono font-bold text-slate-200">{gene}</span>
                        <span className={`font-mono font-bold ${isUp ? 'text-cyan-400' : 'text-rose-400'}`}>
                          {isUp ? `+${numFc.toFixed(2)}` : numFc.toFixed(2)} Log2FC
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                        {!isUp && (
                          <div
                            className="bg-rose-500 h-full rounded-full ml-auto"
                            style={{ width: `${absPct}%` }}
                          />
                        )}
                        {isUp && (
                          <div
                            className="bg-cyan-500 h-full rounded-full"
                            style={{ width: `${absPct}%` }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Single-Cell ATAC-seq Peak Accessibility */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  scATAC-seq Chromatin Accessibility Peaks & TF Motifs
                </h3>
                <span className="text-[10px] text-slate-400">Human Cell Atlas Protocol</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 uppercase text-[10px] font-mono">
                    <tr>
                      <th className="p-2 rounded-l">Genomic Region</th>
                      <th className="p-2">Gene</th>
                      <th className="p-2">Primary Peak</th>
                      <th className="p-2">Met Peak</th>
                      <th className="p-2 rounded-r">TF Binding Motif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {activePair.atacAccessibilityPeaks.map((peak, i) => (
                      <tr key={i} className="hover:bg-slate-850">
                        <td className="p-2 text-slate-400">{peak.region}</td>
                        <td className="p-2 font-bold text-cyan-300">{peak.geneAssociated}</td>
                        <td className="p-2 text-slate-300">{peak.primaryAccess}%</td>
                        <td className="p-2 font-bold text-cyan-400">{peak.metAccess}%</td>
                        <td className="p-2 text-amber-300 text-[10px]">{peak.tfBinding}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Microenvironment Composition Deconvolution (Primary vs Met) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2 mb-3">
                <ArrowRightLeft className="w-4 h-4 text-purple-400" />
                Tumor Microenvironment Deconvolution Shift
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Primary Microenvironment */}
                <div className="bg-slate-850 p-3 rounded-lg border border-slate-800">
                  <span className="font-bold text-slate-300 block mb-2 border-b border-slate-800 pb-1">
                    Primary Tumor Niche (%)
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(activePair.microenvironmentPrimary).map(([cell, pct]) => (
                      <div key={cell} className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">{cell}</span>
                          <span className="font-mono text-slate-200">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-slate-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metastasis Microenvironment */}
                <div className="bg-slate-850 p-3 rounded-lg border border-slate-800">
                  <span className="font-bold text-purple-300 block mb-2 border-b border-slate-800 pb-1">
                    Metastatic Organ Niche (%)
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(activePair.microenvironmentMet).map(([cell, pct]) => (
                      <div key={cell} className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-purple-200 font-medium">{cell}</span>
                          <span className="font-mono text-purple-400 font-bold">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
