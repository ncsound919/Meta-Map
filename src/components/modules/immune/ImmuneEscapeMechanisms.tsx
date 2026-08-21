import React, { useState } from 'react';
import {
  ShieldAlert,
  Dna,
  Zap,
  Activity,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Lock,
  Unlock,
  Layers,
  ArrowRight,
  TrendingUp,
  FlaskConical,
  Info
} from 'lucide-react';

export interface ResistancePathway {
  id: string;
  category: 'primary' | 'acquired' | 'metabolic' | 'epigenetic';
  title: string;
  driverGene: string;
  molecularMechanism: string;
  clinicalPhenotype: string;
  frequency: string;
  associatedCancer: string;
  escapeSignature: string[];
  interceptionStrategy: string;
  approvedOrTrialDrugs: string[];
  potencyIndex: number; // 1-100
}

export const RESISTANCE_PATHWAYS: ResistancePathway[] = [
  {
    id: 'b2m_loss',
    category: 'acquired',
    title: 'B2M Loss & MHC-I Complete Antigen Invisibility',
    driverGene: 'B2M (Inactivating Frameshift / LOH)',
    molecularMechanism: 'Loss of Beta-2-Microglobulin prevents proper folding, stabilization, and cell-surface trafficking of HLA-A/B/C heterodimers, abolishing TCR-mediated CD8+ cytotoxic recognition.',
    clinicalPhenotype: 'Sudden secondary resistance to Anti-PD-1 after prolonged initial response in melanoma and NSCLC.',
    frequency: '15–30% in acquired anti-PD-1 refractory cases',
    associatedCancer: 'Melanoma, CRC (MSI-H), NSCLC',
    escapeSignature: ['B2M null', 'HLA-A/B/C low/absent', 'Intact TMB', 'High IFN-γ resistance'],
    interceptionStrategy: 'Bypass MHC-I dependence via NK-Cell activation (NKG2A/KIR blockade) or MHC-independent Armored CAR-T / Bispecific T-cell Engagers (BiTEs).',
    approvedOrTrialDrugs: ['Monalizumab (Anti-NKG2A)', 'Tarlatamab (DLL3/CD3 BiTE)', 'Anti-KIR mAb (Lirilumab)', 'Allogeneic NK Cells'],
    potencyIndex: 94
  },
  {
    id: 'jak1_jak2_mut',
    category: 'primary',
    title: 'JAK1 / JAK2 Loss-of-Function & IFN-γ Receptor Anergia',
    driverGene: 'JAK1 (p.Q503*, K607fs) / JAK2 (p.E730fs)',
    molecularMechanism: 'Defects in JAK1/JAK2 kinase domains halt phosphorylation of STAT1/STAT2/STAT3 upon IFN-gamma binding, abolishing downstream induction of IRF1, CXCL9/10 chemokines, and neoantigen processing (TAP1/2, LMP2/7).',
    clinicalPhenotype: 'Primary refractory phenotype; lack of tumor-cell PD-L1 upregulation upon T-cell attack and failure of T-cell homing.',
    frequency: '8–12% in anti-PD-1 non-responders',
    associatedCancer: 'Melanoma, Urothelial Carcinoma, Endometrial',
    escapeSignature: ['STAT1-P absent', 'IRF1 null', 'Constitutive PD-L1 negative', 'CXCL9/10 low'],
    interceptionStrategy: 'Activate alternative non-JAK inflammatory cascades (STING agonists, TLR7/8/9 agonists, or Oncolytic Virotherapy) to recruit innate immunity independently of IFNGR signaling.',
    approvedOrTrialDrugs: ['ADU-S100 (STING agonist)', 'Talimogene Laherparepvec (T-VEC)', 'CMP-001 (TLR9 agonist)'],
    potencyIndex: 91
  },
  {
    id: 'lag3_tigit_upreg',
    category: 'acquired',
    title: 'Alternative Immune Checkpoint Redundancy (LAG-3 / TIGIT / TIM-3)',
    driverGene: 'LAG3, TIGIT, HAVCR2 (TIM-3), CD276 (B7-H3)',
    molecularMechanism: 'Upon PD-1 blockade, chronically stimulated TILs upregulate secondary inhibitory co-receptors. LAG-3 binds MHC-II & FGL1 to disrupt TCR signaling; TIGIT competes with CD226 for CD155 (PVR) with 100x higher affinity.',
    clinicalPhenotype: 'Exhausted CD8+ TILs with defective cytokine production (IL-2, TNF-alpha) despite persistent anti-PD-1 target occupancy.',
    frequency: '40–60% of checkpoint-refractory tumors',
    associatedCancer: 'Melanoma, SCLC, NSCLC, Head & Neck SCC',
    escapeSignature: ['LAG-3+ TIGIT+ CD8+ TILs', 'FGL1 secretion', 'CD155 overexpression', 'CD226 downregulation'],
    interceptionStrategy: 'Co-targeting synergistic co-inhibitory axes: Anti-LAG-3 + Anti-PD-1 (Relatlimab + Nivolumab) or Anti-TIGIT + Anti-PD-L1 (Tiragolumab + Atezolizumab).',
    approvedOrTrialDrugs: ['Relatlimab (Opdualag)', 'Tiragolumab (Anti-TIGIT)', 'Sabatolimab (Anti-TIM-3)', 'Enoblituzumab (Anti-B7-H3)'],
    potencyIndex: 88
  },
  {
    id: 'adenosine_cd39_cd73',
    category: 'metabolic',
    title: 'Purinergic Adenosinergic Evasion (CD39 / CD73 Axis)',
    driverGene: 'ENTPD1 (CD39), NT5E (CD73), ADORA2A (A2AR)',
    molecularMechanism: 'Ectonucleotidases CD39 and CD73 sequentially dephosphorylate extracellular ATP (damage signal) into immunosuppressive Adenosine, which binds high-affinity A2A receptors on T/NK cells to elevate intracellular cAMP and paralyze cytolysis.',
    clinicalPhenotype: 'Cold, hypoxic tumor core with profound effector T-cell paralysis and massive Treg accumulation.',
    frequency: '35–55% in solid metastases (PDAC, TNBC, Prostate)',
    associatedCancer: 'Pancreatic Adenocarcinoma, TNBC, Prostate, Ovarian',
    escapeSignature: ['High CD73 expression', 'Elevated extracellular Adenosine', 'A2AR activation', 'Suppressed IFN-γ'],
    interceptionStrategy: 'Enzymatic inhibition of CD73/CD39 combined with small-molecule A2A/A2B receptor antagonists to restore extracellular ATP signaling.',
    approvedOrTrialDrugs: ['Oleclumab (Anti-CD73)', 'TTX-030 (Anti-CD39)', 'Ciforadenant (A2AR antagonist)', 'Iprocidin (A2A/A2B-i)'],
    potencyIndex: 82
  },
  {
    id: 'kynurenine_ido1',
    category: 'metabolic',
    title: 'Tryptophan Catabolism & Kynurenine AhR Axis (IDO1 / TDO2)',
    driverGene: 'IDO1, IDO2, TDO2, AHR',
    molecularMechanism: 'Indoleamine 2,3-dioxygenase-1 (IDO1) catabolizes essential amino acid L-tryptophan into Kynurenine. Tryptophan starvation triggers GCN2 stress response and eIF2α phosphorylation in T cells; Kynurenine activates Aryl Hydrocarbon Receptor (AhR) to expand FOXP3+ Tregs.',
    clinicalPhenotype: 'Immune tolerance in draining lymph nodes and liver/peritoneal metastases.',
    frequency: '30–45% in ovarian, colorectal, and endometrial mets',
    associatedCancer: 'Colorectal, Ovarian, Melanoma, Cervical',
    escapeSignature: ['High Kynurenine / Tryptophan ratio', 'AhR nuclear translocation', 'Treg expansion', 'GCN2 activation'],
    interceptionStrategy: 'Combinatorial IDO1 enzymatic inhibition alongside selective AhR antagonists and immune checkpoint inhibitors.',
    approvedOrTrialDrugs: ['Epacadostat (IDO1-i)', 'Navoximod (NLG-919)', 'BAY-2416964 (AhR antagonist)', 'BMS-986205 (Linrodostat)'],
    potencyIndex: 79
  },
  {
    id: 'wnt_beta_catenin',
    category: 'epigenetic',
    title: 'Oncogenic Wnt/β-Catenin Activation & cDC1 Exclusion',
    driverGene: 'CTNNB1 (Activating Hotspot S33/S37/T41/S45), APC Loss',
    molecularMechanism: 'Constitutive beta-catenin stabilization upregulates transcriptional repressor ATF3, which silences CCL4 transcription. Loss of CCL4 prevents recruitment of BATF3-lineage cross-presenting cDC1 dendritic cells into the tumor.',
    clinicalPhenotype: 'Classical "Immune Desert" cold histology lacking baseline T-cell infiltration.',
    frequency: '25–40% in primary and metastatic melanoma, hepatocellular carcinoma, and CRC',
    associatedCancer: 'HCC, Colorectal, Melanoma, Prostate',
    escapeSignature: ['Nuclear β-catenin', 'CCL4 low/null', 'Zero BATF3+ cDC1s', 'TMB-independent resistance'],
    interceptionStrategy: 'Dual Wnt/beta-catenin inhibition + intratumoral CCL4/FLT3L gene delivery or systemic FLT3L to mobilize dendritic cell cross-presentation.',
    approvedOrTrialDrugs: ['CDX-301 (rhFLT3L)', 'DKN-01 (Anti-DKK1)', 'Porcupine inhibitors (ETC-159)', 'E7386 (CBP/β-catenin-i)'],
    potencyIndex: 86
  }
];

export const ImmuneEscapeMechanisms: React.FC = () => {
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>('b2m_loss');
  const [appliedInterventions, setAppliedInterventions] = useState<string[]>(['Monalizumab (Anti-NKG2A)']);

  const currentPathway = RESISTANCE_PATHWAYS.find((p) => p.id === selectedPathwayId) || RESISTANCE_PATHWAYS[0];

  const handleToggleDrug = (drug: string) => {
    setAppliedInterventions((prev) =>
      prev.includes(drug) ? prev.filter((d) => d !== drug) : [...prev, drug]
    );
  };

  // Rescue Score Calculation
  const isIntervened = currentPathway.approvedOrTrialDrugs.some((d) => appliedInterventions.includes(d));
  const baselineEvasion = currentPathway.potencyIndex;
  const rescuedEvasion = isIntervened ? Math.max(12, baselineEvasion - 68) : baselineEvasion;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Immune Resistance & Escape Mechanisms Atlas</h3>
              <p className="text-xs text-slate-400">
                Systematic dissection of antigen presentation loss, IFN-gamma receptor anergia, alternative checkpoint redundancy, and metabolic immunosuppressive niches.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800">
              6 MOLECULAR ESCAPE ARCHETYPES
            </span>
          </div>
        </div>

        {/* Pathway Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800">
          {RESISTANCE_PATHWAYS.map((pathway) => {
            const isSelected = selectedPathwayId === pathway.id;
            return (
              <button type="button"
                key={pathway.id}
                onClick={() => {
                  setSelectedPathwayId(pathway.id);
                  setAppliedInterventions([pathway.approvedOrTrialDrugs[0]]);
                }}
                className={`p-3 rounded-xl text-left border transition-all space-y-1 ${
                  isSelected
                    ? 'bg-slate-800 border-rose-500 shadow-md shadow-rose-950/40 ring-1 ring-rose-500/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {pathway.category}
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 font-bold">
                    Evasion: {pathway.potencyIndex}%
                  </span>
                </div>
                <div className="font-bold text-xs text-white line-clamp-1">{pathway.title}</div>
                <div className="text-[10px] font-mono text-slate-400 line-clamp-1">{pathway.driverGene}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Molecular Architecture & Targeted Rescue Sandbox */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Molecular & Pathological Dissection */}
        <div className="xl:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Dna className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-sm text-white">{currentPathway.title}</h4>
            </div>
            <span className="text-xs font-mono text-slate-400">{currentPathway.frequency}</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">DRIVER MUTATION / DEFECT</span>
              <div className="text-xs font-mono font-bold text-cyan-300">{currentPathway.driverGene}</div>
              <div className="text-[11px] text-slate-400 font-mono">Prevalent in: {currentPathway.associatedCancer}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">MOLECULAR SIGNALING & BIOPHYSICS</span>
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {currentPathway.molecularMechanism}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">CLINICAL PRESENTATION & RECOURSE</span>
              <div className="text-xs text-amber-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                {currentPathway.clinicalPhenotype}
              </div>
            </div>

            {/* Genomic Signature Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Diagnostic Biomarker Signature</span>
              <div className="flex flex-wrap gap-1.5">
                {currentPathway.escapeSignature.map((sig, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800"
                  >
                    • {sig}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Targeted Rescue Sandbox */}
        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h4 className="font-bold text-sm text-white">Targeted Interception & Drug Sandbox</h4>
            </div>
            <span className="text-xs font-mono text-slate-400">Rescue Engine</span>
          </div>

          <div className="space-y-3.5">
            {/* Evasion Potency Bar */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Effective Evasion Potency:</span>
                <span className={`font-bold ${isIntervened ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {rescuedEvasion}% ({isIntervened ? 'REPRESSED' : 'ACTIVE ESCAPE'})
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isIntervened ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${rescuedEvasion}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                {isIntervened
                  ? '✓ Targeted rescue agent successfully bypasses or reverses this resistance axis.'
                  : '⚠ Tumor clone actively eludes standard anti-PD-1 / cytotoxic T-cell immunity.'}
              </p>
            </div>

            {/* Strategic Rationale */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-purple-400 uppercase font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Targeted Strategy
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentPathway.interceptionStrategy}
              </p>
            </div>

            {/* Approved & Clinical Trial Drug Interventions */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Select Interventional Agents to Apply:
              </span>
              <div className="space-y-1.5">
                {currentPathway.approvedOrTrialDrugs.map((drug) => {
                  const isActive = appliedInterventions.includes(drug);
                  return (
                    <button type="button"
                      key={drug}
                      onClick={() => handleToggleDrug(drug)}
                      className={`w-full p-2.5 rounded-xl border text-left font-mono text-xs flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-md shadow-purple-950/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isActive ? <CheckCircle2 className="w-4 h-4 text-purple-400" /> : <div className="w-4 h-4 rounded-full border border-slate-700"></div>}
                        {drug}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        isActive ? 'bg-purple-900 text-purple-300' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {isActive ? 'INFUSED' : '+ INFUSE'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
