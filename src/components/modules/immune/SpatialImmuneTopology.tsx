import React, { useState } from 'react';
import {
  Flame,
  ShieldAlert,
  Snowflake,
  Layers,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export type SpatialPhenotype = 'hot' | 'excluded' | 'cold';

export interface PhenotypeData {
  id: SpatialPhenotype;
  name: string;
  badge: string;
  badgeColor: string;
  textColor: string;
  description: string;
  characteristics: string[];
  recommendedStrategy: string;
  mechanisms: string;
  tcellDensity: number;
  stromalStiffness: number; // kPa
  tgfBetaLevel: number;
}

export const PHENOTYPES: Record<SpatialPhenotype, PhenotypeData> = {
  hot: {
    id: 'hot',
    name: 'Immune-Inflamed ("Hot")',
    badge: 'HOT / INFLAMED',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    textColor: 'text-rose-400',
    description: 'High CD8+ T cell intratumoral penetration in direct contact with tumor parenchyma. Accompanied by IFN-gamma signature and high PD-L1 expression.',
    characteristics: [
      'High CD8+ & CD4+ Th1 intratumoral infiltration',
      'Elevated IFN-gamma, CXCL9, and CXCL10 expression',
      'High Tumor Mutational Burden (TMB) or MSI-H',
      'Frequent PD-L1 positivity (CPS ≥ 10)'
    ],
    recommendedStrategy: 'Anti-PD-1 / Anti-PD-L1 Monotherapy or Dual Checkpoint Blockade (Anti-PD-1 + Anti-CTLA-4). Rapid RECIST response rate.',
    mechanisms: 'Direct checkpoint reversal re-energizes pre-existing intratumoral tumor-infiltrating lymphocytes (TILs).',
    tcellDensity: 1200,
    stromalStiffness: 2.1,
    tgfBetaLevel: 15
  },
  excluded: {
    id: 'excluded',
    name: 'Immune-Excluded ("Trapped")',
    badge: 'EXCLUDED / ENTRAPPED',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    textColor: 'text-amber-400',
    description: 'Abundant immune effector cells are present, but are physically trapped within the peritumoral stroma and dense collagen matrix, unable to penetrate the malignant core.',
    characteristics: [
      'Peritumoral T cell accumulation arrested at margin',
      'Dense FAP+ CAF stroma with Collagen I/III bundles',
      'High TGF-beta1 & CXCL12-CXCR4 repulsive chemokine coat',
      'Elevated tissue stiffness (>12 kPa) and interstitial fluid pressure'
    ],
    recommendedStrategy: 'Matrix-Breaker Combination: Anti-TGF-beta + FAK Inhibitor + CSF-1R-i + Anti-PD-L1 to dismantle the stromal cage.',
    mechanisms: 'Inhibiting TGF-beta/FAK normalizes the extracellular matrix, allowing peritumoral CD8+ T cells to infiltrate the tumor core.',
    tcellDensity: 450,
    stromalStiffness: 14.5,
    tgfBetaLevel: 88
  },
  cold: {
    id: 'cold',
    name: 'Immune-Desert ("Cold")',
    badge: 'COLD / DESERT',
    badgeColor: 'bg-sky-950 text-sky-300 border-sky-800',
    textColor: 'text-sky-400',
    description: 'Virtually complete absence of CD8+ T cells in both tumor parenchyma and surrounding stroma. Characterized by defective antigen presentation and lack of priming.',
    characteristics: [
      'Absence of CD8+ TILs in parenchyma and invasive margin',
      'Defective cDC1 / BATF3 dendritic cell cross-presentation',
      'Low Tumor Mutational Burden (TMB-Low), loss of HLA-A/B/C',
      'Wnt/beta-catenin or PTEN-loss immune exclusion signaling'
    ],
    recommendedStrategy: 'Innate Priming & Synthetic Vaccines: Intratumoral STING / TLR-9 Agonists + Neoantigen Vaccine + Adoptive CAR-T / TCR-T cell transfer.',
    mechanisms: 'Forces antigen presentation, recruits dendritic cells, and artificially primes tumor-reactive T cell clonotypes.',
    tcellDensity: 45,
    stromalStiffness: 4.8,
    tgfBetaLevel: 32
  }
};

export const SpatialImmuneTopology: React.FC = () => {
  const [selectedPhenotype, setSelectedPhenotype] = useState<SpatialPhenotype>('excluded');
  const [applyMatrixBreaker, setApplyMatrixBreaker] = useState<boolean>(false);

  const current = PHENOTYPES[selectedPhenotype];

  // Dynamic adjusted values if matrix breaker is applied to excluded phenotype
  const effectiveTCell = (selectedPhenotype === 'excluded' && applyMatrixBreaker)
    ? 980
    : current.tcellDensity;

  const effectiveStiffness = (selectedPhenotype === 'excluded' && applyMatrixBreaker)
    ? 3.2
    : current.stromalStiffness;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Spatial Immune Topology & Infiltration Phenotypes
            </h3>
            <p className="text-xs text-slate-400">
              Classify tumors into Inflamed (Hot), Excluded (Trapped), and Desert (Cold) spatial architectures to optimize precision immunotherapy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold border ${current.badgeColor}`}>
              {current.badge}
            </span>
          </div>
        </div>

        {/* 3-State Phenotype Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {Object.values(PHENOTYPES).map((phenotype) => {
            const isSelected = selectedPhenotype === phenotype.id;
            return (
              <button type="button"
                key={phenotype.id}
                onClick={() => {
                  setSelectedPhenotype(phenotype.id);
                  setApplyMatrixBreaker(false);
                }}
                className={`p-4 rounded-xl text-left border transition-all space-y-2 ${
                  isSelected
                    ? 'bg-slate-800 border-amber-500 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${phenotype.textColor}`}>
                    {phenotype.name}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {phenotype.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Spatial Topology Visualization & Strategy Formulation */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Spatial Architecture Map */}
        <div className="xl:col-span-6 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold font-mono text-slate-300">Spatial Infiltration Schematic</h4>
            <span className="text-[10px] font-mono text-slate-500">Histological Tissue Architecture</span>
          </div>

          {/* Graphical Representation of the Tissue Compartments */}
          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-4 relative overflow-hidden">
            {/* Outer Margin: Stroma */}
            <div className={`p-4 rounded-xl border transition-all ${
              selectedPhenotype === 'excluded' && !applyMatrixBreaker
                ? 'bg-purple-950/40 border-purple-600/80'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-purple-400">
                  Peritumoral Stroma & ECM Capsule
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Stiffness: {effectiveStiffness} kPa
                </span>
              </div>

              {/* T Cell dots in stroma */}
              <div className="flex flex-wrap gap-1.5 py-1">
                {Array.from({ length: selectedPhenotype === 'cold' ? 2 : selectedPhenotype === 'excluded' ? 18 : 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"
                    title="CD8+ T Cell"
                  />
                ))}
              </div>

              {/* Inner Core: Tumor Parenchyma */}
              <div className={`mt-4 p-5 rounded-lg border text-center transition-all ${
                selectedPhenotype === 'hot' || (selectedPhenotype === 'excluded' && applyMatrixBreaker)
                  ? 'bg-rose-950/40 border-rose-500'
                  : 'bg-red-950/20 border-red-900/40'
              }`}>
                <div className="text-xs font-mono font-bold text-rose-300 mb-2">
                  TUMOR PARENCHYMA CORE
                </div>

                {/* T Cells inside tumor parenchyma */}
                <div className="flex flex-wrap justify-center gap-2 py-2">
                  {Array.from({
                    length: selectedPhenotype === 'hot' ? 16 :
                            (selectedPhenotype === 'excluded' && applyMatrixBreaker) ? 14 :
                            selectedPhenotype === 'excluded' ? 1 : 0
                  }).map((_, i) => (
                    <span
                      key={i}
                      className="w-3 h-3 rounded-full bg-cyan-400 border border-cyan-200 animate-pulse"
                      title="Intratumoral CD8+ Killer"
                    />
                  ))}
                  {selectedPhenotype === 'cold' && (
                    <span className="text-xs font-mono text-slate-500 italic">
                      Zero Infiltrating Lymphocytes (Immune Desert)
                    </span>
                  )}
                  {selectedPhenotype === 'excluded' && !applyMatrixBreaker && (
                    <span className="text-xs font-mono text-amber-400/80 italic">
                      Excluded by Dense FAP+ Collagen Shell
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-mono text-slate-400 block mt-1">
                  Intratumoral CD8+ Density: <strong className="text-cyan-400">{effectiveTCell} cells/mm³</strong>
                </span>
              </div>
            </div>

            {/* Matrix Breaker Intercept Action (for Excluded phenotype) */}
            {selectedPhenotype === 'excluded' && (
              <div className="p-3.5 bg-slate-900 rounded-xl border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Interventional Matrix Degradation
                  </span>
                  <button type="button"
                    onClick={() => setApplyMatrixBreaker(!applyMatrixBreaker)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      applyMatrixBreaker
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                        : 'bg-slate-800 text-amber-300 border border-amber-500/50 hover:bg-slate-700'
                    }`}
                  >
                    {applyMatrixBreaker ? '✓ FAK-i + Anti-TGF-β INFUSED' : '+ Apply FAK-i & Anti-TGF-β'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-300">
                  {applyMatrixBreaker
                    ? 'Stromal collagen bundles cleaved. Interstitial pressure normalized. CD8+ T cells stream from peritumoral stroma directly into tumor core!'
                    : 'Click to simulate converting this Excluded phenotype into an Inflamed "Hot" response.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pathobiology & Regimen Architecture */}
        <div className="xl:col-span-6 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">
              Phenotype Pathobiology & Therapeutic Prescription
            </h4>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${current.badgeColor}`}>
              {current.id.toUpperCase()}
            </span>
          </div>

          <div className="space-y-3">
            {/* Hallmark Characteristics */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Hallmark Biomarker Features</span>
              <div className="space-y-1">
                {current.characteristics.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800/80 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Strategy */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Recommended Interception Regimen</span>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
                {current.recommendedStrategy}
              </div>
            </div>

            {/* Underlying Biophysical Mechanism */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Biophysical & Biological Rationale</span>
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {current.mechanisms}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
