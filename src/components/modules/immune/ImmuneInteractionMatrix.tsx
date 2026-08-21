import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Activity,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';

export interface ImmuneNode {
  id: string;
  name: string;
  category: 'effector' | 'suppressor' | 'myeloid' | 'stroma' | 'tumor';
  marker: string;
  color: string;
  bgColor: string;
  description: string;
}

export interface InteractionEdge {
  from: string;
  to: string;
  effect: 'activate' | 'inhibit' | 'kill' | 'convert';
  mediator: string;
  strength: number; // -1.0 to +1.0
  reversibility: string;
  checkpointTarget?: string;
  mechanism: string;
}

export const IMMUNE_NODES: ImmuneNode[] = [
  {
    id: 'cd8_tcell',
    name: 'CD8+ Effector T Cell',
    category: 'effector',
    marker: 'CD8A, GZMB, PRF1, IFNG',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/30',
    description: 'Antigen-specific cytotoxic killer recognizing neoepitopes presented on MHC-I.'
  },
  {
    id: 'nk_cell',
    name: 'Natural Killer (NK) Cell',
    category: 'effector',
    marker: 'NCAM1 (CD56), NKG2D, CD16',
    color: 'text-sky-300',
    bgColor: 'bg-sky-500/10 border-sky-500/30',
    description: 'Innate cytotoxic effector executing "missing-self" lysis of MHC-I-deficient tumor variants.'
  },
  {
    id: 'cdc1_dc',
    name: 'cDC1 Dendritic Cell',
    category: 'myeloid',
    marker: 'BATF3, CLEC9A, IL12B',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/30',
    description: 'Cross-presenting dendritic cell essential for priming tumor-specific CD8+ T cells in draining lymph nodes.'
  },
  {
    id: 'm1_tam',
    name: 'M1 Pro-inflammatory Macrophage',
    category: 'myeloid',
    marker: 'NOS2, TNF, CD80, CD86',
    color: 'text-teal-300',
    bgColor: 'bg-teal-500/10 border-teal-500/30',
    description: 'Phagocytic and tumoricidal macrophage secreting IL-12 and TNF-alpha.'
  },
  {
    id: 'm2_tam',
    name: 'M2 Pro-tumoral Macrophage',
    category: 'suppressor',
    marker: 'CD163, CD206, ARG1, IL10',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
    description: 'Immunosuppressive TAM producing TGF-beta, Arginase-1, and VEGF to starve T cells and drive angiogenesis.'
  },
  {
    id: 'treg',
    name: 'Regulatory T Cell (Treg)',
    category: 'suppressor',
    marker: 'FOXP3, CD25, CTLA4',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/30',
    description: 'Potent suppressor consuming IL-2, secreting TGF-beta/IL-10, and stripping CD80/CD86 via CTLA-4.'
  },
  {
    id: 'mdsc',
    name: 'Myeloid-Derived Suppressor (MDSC)',
    category: 'suppressor',
    marker: 'S100A9, CD33, IDO1, iNOS',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
    description: 'Immature myeloid population exhausting T cells via L-arginine / L-tryptophan starvation and ROS.'
  },
  {
    id: 'caf_stroma',
    name: 'FAP+ Cancer-Assoc. Fibroblast',
    category: 'stroma',
    marker: 'FAP, ACTA2, TGFB1, CXCL12',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/30',
    description: 'Matrix-depositing stromal barrier trapping CD8+ T cells in peritumoral collagen capsules via CXCL12-CXCR4 coat.'
  },
  {
    id: 'tumor_cell',
    name: 'Metastatic Tumor Clone',
    category: 'tumor',
    marker: 'PD-L1, CD47, B7-H3, HLA-A',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/30',
    description: 'Evolving malignant seed deploying immune checkpoints, shedding MHC-I, and producing immunosuppressive adenosine.'
  }
];

export const INTERACTION_EDGES: InteractionEdge[] = [
  // CD8+ T Cell vs Tumor
  {
    from: 'cd8_tcell',
    to: 'tumor_cell',
    effect: 'kill',
    mediator: 'Perforin, Granzyme B, FasL',
    strength: 0.9,
    reversibility: 'Irreversible (Apoptosis)',
    checkpointTarget: 'TCR : pMHC-I synapse',
    mechanism: 'Pore formation in tumor plasma membrane followed by granzyme-mediated caspase activation.'
  },
  // Tumor vs CD8+ T Cell
  {
    from: 'tumor_cell',
    to: 'cd8_tcell',
    effect: 'inhibit',
    mediator: 'PD-L1 : PD-1, CD155 : TIGIT',
    strength: -0.85,
    reversibility: 'Targeted (Anti-PD-1 / Anti-PD-L1)',
    checkpointTarget: 'PD-1 / PD-L1 Axis',
    mechanism: 'SHP-2 phosphatase recruitment dephosphorylating CD28 and TCR proximal signaling cascades.'
  },
  // Treg vs CD8+ T Cell
  {
    from: 'treg',
    to: 'cd8_tcell',
    effect: 'inhibit',
    mediator: 'IL-2 Consumption, TGF-β, IL-10, CTLA-4',
    strength: -0.8,
    reversibility: 'Dismantlable (Anti-CTLA-4, Treg Depletion)',
    checkpointTarget: 'CTLA-4 / CD25 / TGF-β',
    mechanism: 'High-affinity IL-2 starvation (CD25) and trans-endocytosis of CD80/CD86 costimulatory ligands.'
  },
  // NK Cell vs Tumor
  {
    from: 'nk_cell',
    to: 'tumor_cell',
    effect: 'kill',
    mediator: 'NKG2D ligands (MICA/B), TRAIL',
    strength: 0.75,
    reversibility: 'Irreversible (Lysis)',
    checkpointTarget: 'NKG2A / TIGIT / KIR',
    mechanism: 'Lysis of MHC-I deficient tumor clones that evade CD8+ T cell TCR recognition.'
  },
  // cDC1 vs CD8+ T Cell
  {
    from: 'cdc1_dc',
    to: 'cd8_tcell',
    effect: 'activate',
    mediator: 'IL-12, CXCL9/10, CD80/CD86, MHC-I',
    strength: 0.95,
    reversibility: 'Stimulatory (STING agonists)',
    checkpointTarget: 'CD40-CD40L / STING Agonism',
    mechanism: 'Antigen cross-presentation and provision of Signal 1 (pMHC), Signal 2 (CD28), and Signal 3 (IL-12).'
  },
  // CAF Stroma vs CD8+ T Cell
  {
    from: 'caf_stroma',
    to: 'cd8_tcell',
    effect: 'inhibit',
    mediator: 'Collagen I/III crosslinking, CXCL12, TGF-β',
    strength: -0.75,
    reversibility: 'Reversible (FAK-i, Anti-TGF-β, CXCR4-i)',
    checkpointTarget: 'FAK / TGF-βR1 / CXCR4',
    mechanism: 'Physical steric entrapment in peritumoral fibrotic cuffs and CXCL12 repulsion.'
  },
  // M2 TAM vs CD8+ T Cell
  {
    from: 'm2_tam',
    to: 'cd8_tcell',
    effect: 'inhibit',
    mediator: 'Arginase-1, PD-L1, IL-10, TGF-β',
    strength: -0.7,
    reversibility: 'Repolarizable (CSF-1R-i, TLR Agonists)',
    checkpointTarget: 'CSF-1R / CD206 / Arginase-1',
    mechanism: 'Depletes extracellular L-arginine necessary for T cell receptor CD3zeta chain assembly.'
  },
  // M1 TAM vs Tumor
  {
    from: 'm1_tam',
    to: 'tumor_cell',
    effect: 'kill',
    mediator: 'Phagocytosis, TNF-α, NO (Nitric Oxide)',
    strength: 0.7,
    reversibility: 'Potentiated (Anti-CD47 / SIRPα Blockade)',
    checkpointTarget: 'CD47 : SIRPα "Don\'t Eat Me"',
    mechanism: 'Fc-receptor mediated engulfment and nitric oxide oxidative burst killing.'
  },
  // Tumor vs M1 (Converting M1 -> M2)
  {
    from: 'tumor_cell',
    to: 'm1_tam',
    effect: 'convert',
    mediator: 'CSF-1, CCL2, Lactic Acid, IL-4/IL-13',
    strength: -0.8,
    reversibility: 'Invertible (CSF-1R-i, HDAC6-i)',
    checkpointTarget: 'CSF-1 / CSF-1R',
    mechanism: 'Tumor acidosis and lactate polarize anti-tumor M1 macrophages into pro-angiogenic M2 TAMs.'
  },
  // MDSC vs CD8+ T Cell
  {
    from: 'mdsc',
    to: 'cd8_tcell',
    effect: 'inhibit',
    mediator: 'IDO1 (Tryptophan -> Kynurenine), ROS, iNOS',
    strength: -0.8,
    reversibility: 'Inhibitable (IDO1-i, CCR2-i)',
    checkpointTarget: 'IDO1 / AHR Axis',
    mechanism: 'Kynurenine binding to AhR induces T cell arrest and promotes de novo Treg differentiation.'
  }
];

export const ImmuneInteractionMatrix: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<string>('cd8_tcell');
  const [selectedTarget, setSelectedTarget] = useState<string>('tumor_cell');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const selectedEdge = INTERACTION_EDGES.find(
    (e) => e.from === selectedSource && e.to === selectedTarget
  );

  const getEdge = (sourceId: string, targetId: string) => {
    return INTERACTION_EDGES.find((e) => e.from === sourceId && e.to === targetId);
  };

  const filteredNodes = filterCategory === 'all'
    ? IMMUNE_NODES
    : IMMUNE_NODES.filter((n) => n.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Tumor Microenvironment (TME) Cross-Talk Grid</h3>
              <p className="text-xs text-slate-400">
                Pairwise interaction matrix mapping activation, inhibition, and immune-checkpoint suppression across lymphoid, myeloid, and stromal compartments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              9 KEY TME COMPARTMENTS
            </span>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800">
              PAIRWISE MECHANISTIC EDGES
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-mono text-slate-400">Filter Nodes:</span>
          {['all', 'effector', 'suppressor', 'myeloid', 'stroma', 'tumor'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                filterCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All (9x9)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column: Matrix Grid & Detailed Edge Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Interactive N x N Matrix */}
        <div className="xl:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold font-mono text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Click Any Cell to Inspect Interaction Dynamics
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Row: Source → Column: Target</span>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-2">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-[10px] font-mono text-slate-500">Source \ Target</th>
                  {filteredNodes.map((target) => (
                    <th key={target.id} className="p-1.5 text-[9px] font-mono text-slate-400 max-w-[65px] truncate">
                      {target.name.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredNodes.map((source) => (
                  <tr key={source.id} className="border-t border-slate-800/60">
                    <td className="p-2 text-left text-[10px] font-mono font-bold text-slate-300 whitespace-nowrap">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${source.color.replace('text-', 'bg-')}`}></span>
                      {source.name}
                    </td>

                    {filteredNodes.map((target) => {
                      const edge = getEdge(source.id, target.id);
                      const isSelected = selectedSource === source.id && selectedTarget === target.id;

                      let cellBg = 'bg-slate-900/40 text-slate-600 hover:bg-slate-800/80';
                      let cellIcon = '—';

                      if (source.id === target.id) {
                        cellBg = 'bg-slate-950 text-slate-700';
                        cellIcon = '•';
                      } else if (edge) {
                        if (edge.effect === 'kill') {
                          cellBg = 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold hover:bg-rose-500/40';
                          cellIcon = '⚔ Lysis';
                        } else if (edge.effect === 'activate') {
                          cellBg = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold hover:bg-emerald-500/40';
                          cellIcon = '+ Stim';
                        } else if (edge.effect === 'inhibit') {
                          cellBg = 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/40';
                          cellIcon = '⊣ Block';
                        } else if (edge.effect === 'convert') {
                          cellBg = 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold hover:bg-purple-500/40';
                          cellIcon = '↻ Polarize';
                        }
                      }

                      return (
                        <td key={target.id} className="p-1">
                          <button
                            onClick={() => {
                              setSelectedSource(source.id);
                              setSelectedTarget(target.id);
                            }}
                            className={`w-full py-2 px-1 rounded-lg text-[10px] font-mono transition-all ${cellBg} ${
                              isSelected ? 'ring-2 ring-cyan-400 shadow-lg scale-105 z-10' : ''
                            }`}
                          >
                            {cellIcon}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Matrix Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/40 border border-rose-500"></span> Cytotoxic Lysis (Kill)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500"></span> Priming / Activation (+)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-500"></span> Checkpoint Inhibition (⊣)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-purple-500/40 border border-purple-500"></span> Phenotypic Polarization (↻)
            </span>
          </div>
        </div>

        {/* Right Column: Interaction Edge Inspector */}
        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-sm text-white">Signaling & Checkpoint Dissection</h4>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {selectedSource} → {selectedTarget}
            </span>
          </div>

          {/* Source & Target Nodes Display */}
          {(() => {
            const srcNode = IMMUNE_NODES.find((n) => n.id === selectedSource);
            const tgtNode = IMMUNE_NODES.find((n) => n.id === selectedTarget);

            if (!srcNode || !tgtNode) return null;

            return (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className={`p-3 rounded-xl border ${srcNode.bgColor} space-y-1`}>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Source Entity</span>
                    <div className={`font-bold text-xs ${srcNode.color}`}>{srcNode.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{srcNode.marker}</div>
                  </div>

                  <div className={`p-3 rounded-xl border ${tgtNode.bgColor} space-y-1`}>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Target Entity</span>
                    <div className={`font-bold text-xs ${tgtNode.color}`}>{tgtNode.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{tgtNode.marker}</div>
                  </div>
                </div>

                {/* Edge Details */}
                {selectedEdge ? (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">Interaction Mode:</span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        selectedEdge.effect === 'kill' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        selectedEdge.effect === 'activate' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        selectedEdge.effect === 'inhibit' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}>
                        {selectedEdge.effect.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 block">PRIMARY CYTOKINE / LIGAND MEDIATORS</span>
                      <div className="text-xs font-mono text-cyan-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        {selectedEdge.mediator}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 block">CLINICAL CHECKPOINT / DRUG TARGET</span>
                      <div className="text-xs font-mono text-amber-300 bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                        <span>{selectedEdge.checkpointTarget || 'N/A'}</span>
                        <span className="text-[10px] text-slate-400">({selectedEdge.reversibility})</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 block">BIOPHYSICAL & SIGNALING MECHANISM</span>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        {selectedEdge.mechanism}
                      </p>
                    </div>

                    {/* Relative Interaction Potency Meter */}
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Relative Flux Coefficient:</span>
                        <span className="text-cyan-400 font-bold">{selectedEdge.strength > 0 ? `+${selectedEdge.strength}` : selectedEdge.strength}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            selectedEdge.strength > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.abs(selectedEdge.strength) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
                    <Info className="w-6 h-6 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400">
                      No direct primary signaling axis mapped between <strong className="text-slate-200">{srcNode.name}</strong> and <strong className="text-slate-200">{tgtNode.name}</strong>.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Select cells with active interaction badges (+ Stim, ⊣ Block, ⚔ Lysis, or ↻ Polarize) in the grid to view signaling cascades.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
