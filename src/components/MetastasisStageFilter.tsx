import React from 'react';
import { MetastasisStage } from '../types/metastasis';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MetastasisStageFilterProps {
  selectedStage: MetastasisStage | 'all';
  setSelectedStage: (stage: MetastasisStage | 'all') => void;
}

export const MetastasisStageFilter: React.FC<MetastasisStageFilterProps> = ({
  selectedStage,
  setSelectedStage
}) => {
  const stages: Array<{ id: MetastasisStage; label: string; desc: string; keyGenes: string }> = [
    { id: 'local_invasion', label: '1. Local Invasion', desc: 'EMT, ECM degradation & motility', keyGenes: 'VIM, SNAI1, MMP9, TWIST1' },
    { id: 'intravasation', label: '2. Intravasation', desc: 'Transendothelial migration into vessel', keyGenes: 'VEGFA, TGFB1, ITGAV' },
    { id: 'circulation', label: '3. Circulation', desc: 'CTC survival, shear stress & cluster adhesion', keyGenes: 'CD44, CLDN2, ITGB1' },
    { id: 'extravasation', label: '4. Extravasation', desc: 'Organ endothelial binding & passage', keyGenes: 'L1CAM, E-Selectin, CXCR4' },
    { id: 'colonization', label: '5. Colonization', desc: 'Organotropism seed-and-soil homing', keyGenes: 'c-MET, HGF, RANKL' },
    { id: 'dormancy', label: '6. Dormancy', desc: 'Quiescence & osteoclastic / astrocyte micro-niche', keyGenes: 'NR2F1, TGFB2, CDKN1B' },
    { id: 'outgrowth', label: '7. Outgrowth', desc: 'Macrometastasis, angiogen:esis & resistance', keyGenes: 'MYC, EGFR, CD274, ABCB1' }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-semibold text-slate-200 tracking-wide uppercase">
            Metastatic Cascade Stage Alignment
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              selectedStage === 'all'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All 7 Cascade Stages
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {stages.map((st, idx) => {
          const isSelected = selectedStage === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setSelectedStage(isSelected ? 'all' : st.id)}
              className={`p-2.5 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md'
                  : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {st.label}
                  </span>
                  {idx < stages.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-600 hidden lg:block" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight mb-2 line-clamp-2">
                  {st.desc}
                </p>
              </div>
              <div className="mt-auto">
                <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/80 text-cyan-400 border border-slate-700/50 truncate max-w-full">
                  {st.keyGenes}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
